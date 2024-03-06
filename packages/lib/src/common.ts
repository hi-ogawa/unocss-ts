// TODO: configurable
export const API_NAME = "tw";
export const PROP_CUSTOM_RULE = "_";
export const PROP_CUSTOM_VARIANT = "_v";
export const PROP_TO_STRING = "$";

//
// Api definition
//

export const API_DEFINITION = /* ts */ `\
import "@hiogawa/unocss-ts";

declare module "@hiogawa/unocss-ts" {
  interface RuntimeType extends Api {}
}

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
  _: (raw: string) => Api; // for rule
  _v: (raw: string, inner: Api) => Api; // for variant
};

// force special property to dump the resulting class string,
// which allows transform to be implemented trivially via regex
type ApiToString = {
  $: string;
};

type Api = ApiProperty & ApiMethod & ApiCustom & ApiToString;
`;
