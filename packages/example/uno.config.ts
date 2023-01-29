import { transformerTypescriptDsl } from "@hiogawa/unocss-typescript-dsl";
import {
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
    btn: tw.cursor_pointer._(`
      transition
      text-white
      bg-blue-500
      disabled:(cursor-not-allowed opacity-50)
      not-disabled:hover:bg-blue-600
    `).$,
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
});
