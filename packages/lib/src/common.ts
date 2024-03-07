// TODO: configurable?
export const API_NAME = "tw";
export const PROP_CUSTOM_RULE = "_";
export const PROP_CUSTOM_VARIANT = "_v";
export const PROP_TO_STRING = "$";

export const TYPE_DEF_INTRO = /* ts */ `\
import "@hiogawa/unocss-ts";

declare module "@hiogawa/unocss-ts" {
  interface RuntimeType extends Tw {}
}

type Property = RuleStatic | RuleDynamic | Shortcut;
type Method = Variant;

type TwProperty = {
  [key in Property]: Tw;
};

type TwMethod = {
  [key in Method]: (tw: Tw) => Tw;
};

interface TwCustom {
  /**
   * arbitrary rule
   * @example tw._("bg-[#123]")
   */
  _: (arbitrary: string) => Tw;
  /**
   * arbitrary variant
   * @example tw._v("aria-selected", tw.text_blue)
   */
  _v: (arbitrary: string, tw: Tw) => Tw;
};

interface TwToString {
  /**
   * terminal to convert runtime into string
   * @example tw.text_blue.$
   */
  $: string;
};

interface Tw extends TwProperty, TwMethod, TwCustom, TwToString {}
`;
