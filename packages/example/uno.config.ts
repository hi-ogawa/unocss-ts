import { transformerTypescriptDsl } from "@hiogawa/unocss-typescript-dsl";
import {
  DynamicRule,
  Variant,
  defineConfig,
  presetIcons,
  presetUno,
  transformerDirectives,
  transformerVariantGroup,
} from "unocss";
import { tw } from "./src/styles/tw";

export default defineConfig({
  theme: {
    colors: {
      primary: "blue",
    },
    aria: {
      "current-page": 'current="page"',
    },
  },
  shortcuts: {
    // ability to use dsl directly in shortcuts (or anywhere)
    btn: tw.cursor_pointer
      ._("transition")
      .text_white.bg_blue_500.disabled(tw.cursor_not_allowed._("opacity-50"))
      .not_disabled(tw.hover(tw.bg_blue_600)).$,
  },
  presets: [
    presetUno(),
    // not supported
    presetIcons({
      extraProperties: {
        display: "inline-block",
      },
    }),
  ],
  // requires transformerVariantGroup
  transformers: [
    transformerTypescriptDsl(),
    transformerDirectives(),
    transformerVariantGroup(),
  ],
  // dummy rules/variants to workaround unsupported autocomplete by upstream
  rules: [
    dummyRule("border"),
    dummyRule("(max-|min-|)(w|h)-full"),
    dummyRule("(max-|min-|)(w|h)-<num>"),
  ],
  variants: [dummyVariant("aria-$aria")],
});

function dummyRule(autocomplete: string): DynamicRule {
  return [/a^/, () => "", { autocomplete }];
}

function dummyVariant(autocomplete: string): Variant {
  return {
    match: () => undefined,
    autocomplete,
  };
}
