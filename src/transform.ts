import { escapeRegex, mapRegex } from "./regex-utils";
import { API_NAME, PROP_TO_STRING, createApi } from "./runtime";

// TODO: MagicString based api
export function transform(input: string): string {
  const regex = createRegex(API_NAME, PROP_TO_STRING);
  let output = "";
  mapRegex(
    input,
    regex,
    (match) => {
      output += evaluate(match[0]);
    },
    (other) => {
      output += other;
    }
  );
  return output;
}

function evaluate(input: string): string {
  input;
  createApi;
  return `"(TODO)"`;
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
