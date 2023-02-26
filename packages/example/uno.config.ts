import {
  dummyPresetIconsRules,
  dummyRule,
  dummyVariant,
  transformerTypescriptDsl,
} from "@hiogawa/unocss-typescript-dsl";
import {
  defineConfig,
  Preset,
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
    examplePresetWithPrefix(),
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
    dummyRule("(top|left|right|bottom)-<num>"),
    ...dummyPresetIconsRules(["ri"]),
  ],
  variants: [dummyVariant("aria-$aria")],
});

function examplePresetWithPrefix(): Preset {
  return {
    name: examplePresetWithPrefix.name,
    prefix: "textprefix-",
    rules: [dummyRule("static-rule"), dummyRule("dynamic-rule-<num>")],
    shortcuts: {
      shortcut: "xxx",
    },
    // variant cannot have "prefix"
    variants: [dummyVariant("test-variant-<directions>")],
  };
}
