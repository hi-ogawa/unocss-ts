import { tinyassert } from "@hiogawa/utils";
import { loadConfig } from "@unocss/config";
import { createGenerator } from "@unocss/core";
import { CUSTOM_RULE, CUSTOM_VARIANT } from "./runtime";

async function generateApi() {
  // initialize uno context
  const config = await loadConfig();
  const uno = createGenerator(config.config);
  const ctx = { uno };

  //
  // emit main typescript api
  //
  console.log(`\
//
// typescript API
//

type Property = RuleStatic | RuleDynamic | Shortcut;
type Method = Variant;

type ApiProperty = {
  [key in Property]: Api;
};

type ApiMethod = {
  [key in Method]: (inner: Api) => Api;
};

// escape hatch to allow arbitrary values which are not supported by auto-generation
type ApiCustom = {
  ${CUSTOM_RULE}: (raw: string) => Api; // for rule
  ${CUSTOM_VARIANT}: (raw: string, inner: Api) => Api; // for variant
};

// "string" is to allow assigning to "className" prop
export type Api = ApiProperty & ApiMethod & ApiCustom & string;

//
// auto-generated based on unocss config
//
`);

  //
  // theme (e.g. colors, breakpoint) used for dynamic rule definition
  //
  for (const [name, outer] of Object.entries(ctx.uno.config.theme)) {
    // handle "colors" specific behavior https://github.com/unocss/unocss/blob/2e74b31625bbe3b9c8351570749aa2d3f799d919/packages/preset-mini/src/_utils/utilities.ts#L79
    if (name === "colors") {
      const values: string[] = [];
      for (const [innerName, inner] of Object.entries(outer as any)) {
        if (inner && typeof inner === "object" && !Array.isArray(inner)) {
          const innerValues = Object.keys(inner).map(
            (key) => `${innerName}-${key}`
          );
          values.push(...innerValues);
        } else {
          values.push(innerName);
        }
      }
      const valuesApi = values.map((rule) => rule.replaceAll("-", "_"));
      console.log(toStringUnionType(`Theme_${name}`, valuesApi));

      // handle "animation" special behavior
    } else if (name === "animation") {
      for (const [innerName, inner] of Object.entries(outer as any)) {
        if (inner && typeof inner === "object" && !Array.isArray(inner)) {
          const values = Object.keys(inner);
          const valuesApi = values.map((rule) => rule.replaceAll("-", "_"));
          console.log(
            toStringUnionType(`Theme_${name}_${innerName}`, valuesApi)
          );
        }
      }
    } else {
      const values: string[] = Object.keys(outer as any);
      const valuesApi = values.map((rule) => rule.replaceAll("-", "_"));
      console.log(toStringUnionType(`Theme_${name}`, valuesApi));
    }
  }

  //
  // autocomplete
  //
  for (const [name, values] of Object.entries(AUTOCOMPLETE_BUILTIN)) {
    console.log(toStringUnionType(`Autocomplete_${name}`, values));
  }

  //
  // static rule (e.g. flex, cursor-pointer)
  //
  const rulesStatic = Object.keys(ctx.uno.config.rulesStaticMap);
  const rulesStaticApi = rulesStatic.map((rule) => rule.replaceAll("-", "_"));
  console.log(toStringUnionType("RuleStatic", rulesStaticApi));

  //
  // dynamic rule (e.g. ml-2)
  //
  const rulesDynamic: string[] = [];
  for (const rule of ctx.uno.config.rulesDynamic) {
    const meta = rule[3];
    const autocompletes = [meta?.autocomplete ?? []].flat();
    for (const autocomplete of autocompletes) {
      rulesDynamic.push(resolveAutocomplete(autocomplete));
    }
  }
  const rulesDynamicApi = rulesDynamic.map((rule) => rule.replaceAll("-", "_"));
  console.log(toStringUnionType("RuleDynamic", rulesDynamicApi));

  //
  // variant (e.g. hover)
  //
  const variants: string[] = [];
  for (const variant of ctx.uno.config.variants) {
    // TODO: some variant doesn't have autocomplete? (e.g. hover, aria)
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
  console.log(toStringUnionType("Variant", variantsApi));

  //
  // shortcut
  //
  let shortcuts: string[] = [];
  for (const shortcut of ctx.uno.config.shortcuts) {
    // TODO: support "dynamic" shortcut?
    const key = shortcut[0];
    if (typeof key === "string") {
      shortcuts.push(key);
    }
  }
  const shortcutsApi = shortcuts.map((s) => s.replaceAll("-", "_"));
  console.log(toStringUnionType("Shortcut", shortcutsApi));
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
  return `\
type ${name} =
${values.map((s) => `  | \`${s}\``).join("\n") || "  | never"};
`;
}

//
// based on https://github.com/unocss/unocss/blob/2e74b31625bbe3b9c8351570749aa2d3f799d919/packages/autocomplete/src/parse.ts#L31
//

// (w|h)-$width => `${ "w" | "h" }-${Theme_width}`
function resolveAutocomplete(template: string): string {
  let result = "";
  mapRegex(
    template,
    /<(\w+)>/g,
    (builtin) => {
      builtin = builtin.slice(1, -1);
      tinyassert(builtin in AUTOCOMPLETE_BUILTIN);
      const type = `Autocomplete_${builtin}`;
      result += "${" + type + "}";
    },
    (other) => {
      mapRegex(
        other,
        /\((.*?)\)/g,
        (group) => {
          group = group.slice(1, -1);
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
            (theme) => {
              theme = theme.slice(1);
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

// based on https://github.com/unocss/unocss/blob/2e74b31625bbe3b9c8351570749aa2d3f799d919/packages/autocomplete/src/parse.ts#L11
function mapRegex(
  input: string,
  regex: RegExp,
  onMatch: (part: string) => void,
  onNonMatch: (part: string) => void
) {
  let lastIndex = 0;
  for (const m of input.matchAll(regex)) {
    tinyassert(typeof m.index === "number");
    if (lastIndex < m.index) {
      onNonMatch(input.slice(lastIndex, m.index));
    }
    onMatch(m[0]);
    lastIndex = m.index + m[0].length;
  }
  if (lastIndex < input.length) {
    onNonMatch(input.slice(lastIndex));
  }
}

//
// main
//

function main() {
  generateApi();
}

main();
