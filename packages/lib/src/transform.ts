import vm from "node:vm";
import type { SourceCodeTransformer } from "@unocss/core";
import type MagicString from "magic-string";
import { escapeRegex, mapRegex } from "./regex-utils";
import { API_NAME, PROP_TO_STRING, createApi } from "./runtime";

export function transformerTypescriptDsl(): SourceCodeTransformer {
  return {
    name: "transformer-typescript-dsl",
    enforce: "pre", // must come before `transformerVariantGroup`
    transform: (code, _id, _ctx) => {
      transformMagicString(code);
    },
  };
}

export function transformMagicString(code: MagicString) {
  const output = transform(code.toString());
  code.overwrite(0, code.length(), output);
}

export function transform(input: string): string {
  const regex = createRegex(API_NAME, PROP_TO_STRING);
  let output = "";
  mapRegex(
    input,
    regex,
    (match) => {
      output += evaluate(API_NAME, match[0]);
    },
    (other) => {
      output += other;
    }
  );
  return output;
}

// evaluate code
//   "tw.flex.justify_center.items_center.$" => "flex justify-center items-center"
function evaluate(apiName: string, expression: string): string {
  const api = createApi();
  const context = { __result: "", __api: api };
  const code = `\
const ${apiName} = __api;
__result = ${expression};
`;
  vm.createContext(context);
  vm.runInContext(code, context);
  return `"${context.__result}"`;
}

// match example
//   tw.xxx.yyy(tw.abc).zzz.$
//   ~~~                   ~~
//   apiName               toStringProperty
export function createRegex(apiName: string, toStringProperty: string): RegExp {
  const start = escapeRegex(apiName);
  const end = escapeRegex(toStringProperty);
  const source = String.raw`(?<!\w)${start}\s*\..*?(?:\.)?\s*${end}(?!\w)`;
  //                        ~~~~~~~                                          negative ahead for word boundary
  //                               ~~~~~~~~~~~~~                             start with "tw."
  //                                            ~~                           anything in-between
  //                                               ~~~~~~~~~~~~~~~~          end with ".$" where "." is optional
  //                                                             ``~~~~~~    negative behind for word boundary
  return new RegExp(source, "gms"); // global, multiline, dotall
}
