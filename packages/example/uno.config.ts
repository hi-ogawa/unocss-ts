import { transformerTypescriptDsl } from "@hiogawa/unocss-typescript-dsl";
import {
  DynamicRule,
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
    // not supported
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
  rules: [
    // workaround unsupported autocomplete by dummy rules
    dummyRule("border"),
    dummyRule("(max-|min-|)(w|h)-full"),
    dummyRule("(max-|min-|)(w|h)-<num>"),
  ],
  // requires transformerVariantGroup
  transformers: [
    transformerTypescriptDsl(),
    transformerDirectives(),
    transformerVariantGroup(),
  ],
});

function dummyRule(autocomplete: string): DynamicRule {
  return [/a^/, () => "", { autocomplete }];
}
