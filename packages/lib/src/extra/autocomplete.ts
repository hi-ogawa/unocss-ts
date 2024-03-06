import type { DynamicRule, Preset, Variant } from "unocss";

// workaround missing autocomplete
// https://github.com/hi-ogawa/unocss-typescript-dsl/issues/12

/**
 * @example
 * import riIcons from "@iconify-json/ri/icons.json";
 * presetFixAutocomplete({
 *   rules: ["some-missing-rule"],
 *   variants: ["some-missing-$variant"],
 *   icons: [riIcons]
 * })
 */
export function presetFixAutocomplete(options?: {
  rules?: string[];
  variants?: string[];
  icons?: unknown[];
}): Preset {
  const rules = [...DEFAULT_RULES, ...(options?.rules ?? [])];
  const variants = [...DEFAULT_VARIANTS, ...(options?.variants ?? [])];

  for (const json of options?.icons ?? []) {
    const { prefix, icons } = json as any;
    for (const icon of Object.keys(icons)) {
      rules.push(`i-${prefix}-${icon}`);
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
