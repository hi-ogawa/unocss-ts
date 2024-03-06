import {
  filterColorPallete,
  presetFixAutocomplete,
  transformerTypescriptDsl,
} from "@hiogawa/unocss-typescript-dsl";
import riIcons from "@iconify-json/ri/icons.json";
import {
  Preset,
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
    filterColorPallete(presetUno(), ["blue", "red"]),
    examplePresetWithPrefix(),
    presetIcons({
      extraProperties: {
        display: "inline-block",
      },
    }),
    presetFixAutocomplete({
      rules: ["border"],
      variants: ["aria-$aria"],
      icons: [riIcons],
    }),
  ],
  transformers: [
    transformerTypescriptDsl(),
    transformerDirectives(),
    transformerVariantGroup(),
  ],
});

function examplePresetWithPrefix(): Preset {
  return {
    name: examplePresetWithPrefix.name,
    prefix: "textprefix-",
    rules: [
      [/a^/, () => "", { autocomplete: "static-rule" }],
      [/a^/, () => "", { autocomplete: "dynamic-rule-<num>" }],
    ],
    shortcuts: {
      shortcut: "xxx",
    },
    // variant cannot have "prefix"
    variants: [
      {
        match: () => undefined,
        autocomplete: "test-variant-<directions>",
      },
    ],
  };
}
