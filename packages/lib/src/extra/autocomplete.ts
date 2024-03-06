import type { DynamicRule, Preset, Variant } from "unocss";

// workaround missing autocomplete
// https://github.com/hi-ogawa/unocss-typescript-dsl/issues/12

/**
 * @example
 * presetAutocomplete({
 *   rules: ["some-missing-rule"],
 *   variants: ["some-missing-$variant"],
 *   icons: [await import("@iconify-json/ri/icons.json")]
 * })
 */
export function presetAutocomplete(options?: {
  rules?: string[];
  variants?: string[];
  icons?: any[];
}): Preset {
  const rules = [...DEFAULT_RULES, ...(options?.rules ?? [])];
  const variants = [...DEFAULT_VARIANTS, ...(options?.variants ?? [])];

  for (const json of options?.icons ?? []) {
    for (const icon of Object.keys(json.icons)) {
      rules.push(`i-${json.prefix}-${icon}`);
    }
  }

  return {
    name: "preset-autocomplete",
    rules: rules.map((v) => autocompleteRule(v)),
    variants: variants.map((v) => autocompleteVariant(v)),
  };
}

const DEFAULT_RULES = [
  "bg-$colors",
  "border",
  "transition",
  "(max-|min-|)(w|h)-full",
  "(max-|min-|)(w|h)-<num>",
  "(top|left|right|bottom)-<num>",
  "ring-<num>",
  "opacity-<percent>",
  "rounded-full",
  "absolute",
  "relative",
  "fixed",
];

const DEFAULT_VARIANTS = ["important", "aria-$aria", "media-$media"];

function autocompleteRule(autocomplete: string): DynamicRule {
  return [/a^/, () => "", { autocomplete }];
}

function autocompleteVariant(autocomplete: string): Variant {
  return {
    match: () => undefined,
    autocomplete,
  };
}
