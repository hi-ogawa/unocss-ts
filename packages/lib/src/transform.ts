import { escapeRegExp, mapRegExp, tinyassert } from "@hiogawa/utils";
import type MagicString from "magic-string";
import type { SourceCodeTransformer } from "unocss";
import { API_NAME, PROP_TO_STRING } from "./common";
import { createRuntime } from "./runtime";

export function transformerTypescriptDsl(): SourceCodeTransformer {
  return {
    name: "transformer-unocss-ts",
    enforce: "pre", // must come before `transformerVariantGroup`
    transform: (code, _id, _ctx) => {
      transformMagicString(code);
    },
  };
}

export function transformMagicString(code: MagicString) {
  mapRegExp(
    code.toString(),
    createRegex(API_NAME, PROP_TO_STRING),
    (match) => {
      const { 0: expr, index } = match;
      tinyassert(typeof index === "number");
      code.remove(index, index + expr.length);
      code.appendLeft(index, evaluate(API_NAME, expr));
    },
    (_other) => {},
  );
  return code;
}

export function transformString(input: string): string {
  const regex = createRegex(API_NAME, PROP_TO_STRING);
  let output = "";
  mapRegExp(
    input,
    regex,
    (match) => {
      output += evaluate(API_NAME, match[0]);
    },
    (other) => {
      output += other;
    },
  );
  return output;
}

// evaluate code
//   "tw.flex.justify_center.items_center.$" => "flex justify-center items-center"
function evaluate(apiName: string, expression: string): string {
  const api = createRuntime();
  const result = (0, eval)(`(${apiName}) => ${expression}`)(api);
  return `"${result}"`;
}

// match example
//   tw.xxx.yyy(tw.abc).zzz.$
//   ~~~                   ~~
//   apiName               toStringProperty
export function createRegex(apiName: string, toStringProperty: string): RegExp {
  const start = escapeRegExp(apiName);
  const end = escapeRegExp(toStringProperty);
  const source = String.raw`(?<!\w)${start}\s*\..*?(?:\.)?\s*${end}(?!\w)`;
  //                        ~~~~~~~                                          negative ahead for word boundary
  //                               ~~~~~~~~~~~~~                             start with "tw."
  //                                            ~~                           anything in-between
  //                                               ~~~~~~~~~~~~~~~~          end with ".$" where "." is optional
  //                                                             ``~~~~~~    negative behind for word boundary
  return new RegExp(source, "gms"); // global, multiline, dotall
}
