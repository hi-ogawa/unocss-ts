import { transformerTypescriptDsl } from "@hiogawa/unocss-typescript-dsl";
import {
  defineConfig,
  presetIcons,
  presetUno,
  transformerDirectives,
  transformerVariantGroup,
} from "unocss";

export default defineConfig({
  theme: {
    colors: {
      primary: "blue",
    },
    // TODO: not supported
    aria: {
      "current-page": 'current="page"',
    },
  },
  shortcuts: {
    btn: `
      cursor-pointer
      transition
      disabled:(cursor-not-allowed opacity-50)
      not-disabled:hover:bg-gray-100
    `,
  },
  presets: [
    presetUno(),
    // TODO: not supported
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
