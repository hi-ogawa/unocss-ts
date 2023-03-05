import { tinyassert } from "@hiogawa/utils";
import { loadConfig } from "@unocss/config";
import { createGenerator } from "@unocss/core";
import { z } from "zod";
import { API_DEFINITION } from "./common";
import { mapRegex } from "./regex-utils";

export const Z_GENERATE_API_OPTIONS = z.object({
  cwd: z.string().optional(),
  configFile: z.string().optional(),
  skipNonTailwind: z.boolean().default(true),
});

type GenerateApiOptions = z.infer<typeof Z_GENERATE_API_OPTIONS>;

export async function generateApi(
  options: GenerateApiOptions
): Promise<string> {
  // initialize uno instance
  const config = await loadConfig(options.cwd, options.configFile);
  const uno = createGenerator(config.config);

  //
  // emit main typescript api
  //
  let result = "";
  result += `\
//
// AUTO-GENERATED
//

${API_DEFINITION}

//
// constants based on unocss config
//

`;

  //
  // theme (e.g. colors, breakpoint) used for dynamic rule definition
  //
  for (const [name, outer] of Object.entries(uno.config.theme)) {
    // handle "colors" specific behavior https://github.com/unocss/unocss/blob/2e74b31625bbe3b9c8351570749aa2d3f799d919/packages/preset-mini/src/_utils/utilities.ts#L79
    if (name === "colors") {
      const values: string[] = [];
      for (const [innerName, inner] of Object.entries(outer as any)) {
        if (inner && typeof inner === "object" && !Array.isArray(inner)) {
          let innerValues: string[] = [];
          for (const innerName2 of Object.keys(inner)) {
            if (IGNORED_THEME_KEYS.includes(innerName2)) {
              innerValues.push(innerName);
            } else {
              innerValues.push(`${innerName}-${innerName2}`);
            }
          }
          values.push(...innerValues);
        } else {
          values.push(innerName);
        }
      }
      const valuesApi = values.map((rule) => rule.replaceAll("-", "_"));
      result += toStringUnionType(`Theme_${name}`, valuesApi);

      // handle "animation" special behavior
    } else if (name === "animation") {
      for (const [innerName, inner] of Object.entries(outer as any)) {
        if (inner && typeof inner === "object" && !Array.isArray(inner)) {
          const values = Object.keys(inner);
          const valuesApi = values.map((rule) => rule.replaceAll("-", "_"));
          result += toStringUnionType(`Theme_${name}_${innerName}`, valuesApi);
        }
      }
    } else {
      const values: string[] = Object.keys(outer as any);
      const valuesApi = values.map((rule) => rule.replaceAll("-", "_"));
      result += toStringUnionType(`Theme_${name}`, valuesApi);
    }
  }

  //
  // autocomplete
  //
  for (let [name, values] of Object.entries(AUTOCOMPLETE_BUILTIN)) {
    if (options.skipNonTailwind) {
      values = values.filter((v) => !["s", "e"].includes(v));
    }
    result += toStringUnionType(`Autocomplete_${name}`, values);
  }

  //
  // static rule (e.g. flex, cursor-pointer)
  //
  const rulesStatic = Object.entries(uno.config.rulesStaticMap).map(
    ([key, value]) => (value?.[2]?.prefix ?? "") + key
  );
  const rulesStaticApi = rulesStatic.map((rule) => rule.replaceAll("-", "_"));
  result += toStringUnionType("RuleStatic", rulesStaticApi);

  //
  // dynamic rule (e.g. ml-2)
  //
  const rulesDynamic: string[] = [];
  for (const rule of uno.config.rulesDynamic) {
    const meta = rule[3];
    const autocompletes = [meta?.autocomplete ?? []].flat();
    for (let autocomplete of autocompletes) {
      // find-and-replace to cull some redundancies
      if (options.skipNonTailwind) {
        for (const redundancy of REDUNDANCIES) {
          const from = "(" + redundancy.choice.join("|") + ")";
          const to = redundancy.tailwind;
          autocomplete = autocomplete.replaceAll(from, to);
        }
      }
      const resolved = resolveAutocomplete(autocomplete);
      rulesDynamic.push((meta?.prefix ?? "") + resolved);
    }
  }
  const rulesDynamicApi = rulesDynamic.map((rule) => rule.replaceAll("-", "_"));
  result += toStringUnionType("RuleDynamic", rulesDynamicApi);

  //
  // variant (e.g. hover)
  //
  const variants: string[] = [];
  for (const variant of uno.config.variants) {
    // TODO: some variant doesn't have autocomplete? (e.g. aria-xxx)
    // TODO: variant cannot have "prefix"
    let autocompletes = [variant?.autocomplete ?? []].flat();
    for (let autocomplete of autocompletes) {
      if (typeof autocomplete !== "string") {
        continue;
      }
      if (autocomplete.endsWith(":")) {
        autocomplete = autocomplete.slice(0, -1);
      }
      // TODO: not sure what these are for
      if (autocomplete.startsWith("@")) {
        autocomplete = autocomplete.slice(1);
      }
      if (autocomplete.startsWith(".")) {
        autocomplete = autocomplete.slice(1);
      }
      variants.push(resolveAutocomplete(autocomplete));
    }
  }
  const variantsApi = variants.map((rule) => rule.replaceAll("-", "_"));
  result += toStringUnionType("Variant", variantsApi);

  //
  // shortcut
  //
  let shortcuts: string[] = [];
  for (const shortcut of uno.config.shortcuts) {
    // TODO: support "dynamic" shortcut?
    const key = shortcut[0];
    if (typeof key === "string") {
      shortcuts.push(
        [shortcut[2]?.prefix, key].flat().filter(Boolean).join("")
      );
    }
  }
  const shortcutsApi = shortcuts.map((s) => s.replaceAll("-", "_"));
  result += toStringUnionType("Shortcut", shortcutsApi);

  return result;
}

//
// misc
//

// hard-coded autocomplete shorthands https://github.com/unocss/unocss/blob/2e74b31625bbe3b9c8351570749aa2d3f799d919/packages/autocomplete/src/parse.ts#L3-L7
const AUTOCOMPLETE_BUILTIN = {
  // adding "${number}" will cause some inconveniences e.g.
  //   Property 'm_1' comes from an index signature, so it must be accessed with ['m_1']
  num: [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 24, 36].map(String),
  percent: Array.from({ length: 11 }, (_, i) => i * 10).map(String),
  directions: ["x", "y", "t", "b", "l", "r", "s", "e"],
} satisfies Record<string, string[]>;

function toStringUnionType(name: string, values: string[]): string {
  // "export" to silence unused type warning
  // "never" to gracefully handle empty options
  return `\
export type ${name} =
${values.map((s) => `  | \`${s}\``).join("\n") || "  | never"}
;

`;
}

// https://github.com/unocss/unocss/blob/33290b66103c0c35e868212fd6c12947faa0a027/packages/autocomplete/src/parse.ts#L9
const IGNORED_THEME_KEYS = ["DEFAULT"];

// https://github.com/hi-ogawa/unocss-typescript-dsl/issues/8
const REDUNDANCIES = [
  {
    tailwind: "opacity",
    choice: ["op", "opacity"],
  },
  {
    tailwind: "text",
    choice: ["text", "color", "c"],
  },
  {
    tailwind: "border",
    choice: ["border", "b"],
  },
];

//
// based on https://github.com/unocss/unocss/blob/2e74b31625bbe3b9c8351570749aa2d3f799d919/packages/autocomplete/src/parse.ts#L31
//

// (w|h)-$width => `${ "w" | "h" }-${Theme_width}`
function resolveAutocomplete(template: string): string {
  let result = "";
  mapRegex(
    template,
    /<(\w+)>/g,
    (match) => {
      const builtin = match[1];
      // builtin = builtin.slice(1, -1);
      tinyassert(builtin);
      tinyassert(builtin in AUTOCOMPLETE_BUILTIN);
      const type = `Autocomplete_${builtin}`;
      result += "${" + type + "}";
    },
    (other) => {
      mapRegex(
        other,
        /\((.*?)\)/g,
        (match) => {
          const group = match[1];
          tinyassert(group);
          // group = group.slice(1, -1);
          const type = group
            .split("|")
            .map((e) => `"${e}"`)
            .join(" | ");
          result += "${" + type + "}";
        },
        (other) => {
          mapRegex(
            other,
            /\$([\w\.\|]+)/g,
            (match) => {
              let theme = match[1];
              tinyassert(theme);
              // theme = theme.slice(1);
              // handle a few known exceptional cases
              // (w|h)-$width|height|maxWidth|maxHeight|minWidth|minHeight|inlineSize|blockSize|maxInlineSize|maxBlockSize|minInlineSize|minBlockSize
              if (theme.includes("|")) {
                theme = theme.split("|")[0]!;
              }
              // animate-$animation.keyframes
              if (theme.includes(".")) {
                theme = theme.replaceAll(".", "_");
              }
              const type = `Theme_${theme}`;
              result += "${" + type + "}";
            },
            (other) => {
              result += other;
            }
          );
        }
      );
    }
  );
  return result;
}
