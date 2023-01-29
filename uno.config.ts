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
    presetIcons({
      extraProperties: {
        display: "inline-block",
      },
    }),
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()],
});
