import {
  presetFixAutocomplete,
  transformerTypescriptDsl,
  tw,
} from "@hiogawa/unocss-ts";
import riIcons from "@iconify-json/ri/icons.json";
import {
  defineConfig,
  presetIcons,
  presetUno,
  transformerVariantGroup,
} from "unocss";

export default defineConfig({
  shortcuts: {
    // you can use `tw` without transform, so it can be used to define shortcut
    btn: tw.cursor_pointer
      ._("transition")
      .text_white.bg_blue_500.disabled(tw.cursor_not_allowed._("opacity-50"))
      .not_disabled(tw.hover(tw.bg_blue_600)).$,
  },
  presets: [
    presetUno(),
    presetIcons(),
    // provide missing autocomplete
    presetFixAutocomplete({
      rules: [],
      variants: [],
      icons: [riIcons],
    }),
  ],
  transformers: [transformerTypescriptDsl(), transformerVariantGroup()],
});
