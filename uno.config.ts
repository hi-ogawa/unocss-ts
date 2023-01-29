import { defineConfig, presetUno } from "unocss";

export default defineConfig({
  theme: {
    colors: {
      primary: "blue",
    },
  },
  shortcuts: {
    btn: `cursor-pointer text-white bg-blue-400`,
  },
  presets: [presetUno()],
});
