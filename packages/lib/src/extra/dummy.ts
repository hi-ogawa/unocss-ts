import type { DynamicRule, Preset, Variant } from "unocss";

// workaround missing autocomplete
// https://github.com/hi-ogawa/unocss-typescript-dsl/issues/12

export function dummyRule(autocomplete: string): DynamicRule {
  return [/a^/, () => "", { autocomplete }];
}

export function dummyVariant(autocomplete: string): Variant {
  return {
    match: () => undefined,
    autocomplete,
  };
}

export function dummyPreset(): Preset {
  return {
    name: "dummy-preset",
    rules: [
      dummyRule("border"),
      dummyRule("transition"),
      dummyRule("(max-|min-|)(w|h)-full"),
      dummyRule("(max-|min-|)(w|h)-<num>"),
      dummyRule("(top|left|right|bottom)-<num>"),
    ],
    variants: [dummyVariant("important"), dummyVariant("aria-$aria")],
  };
}
