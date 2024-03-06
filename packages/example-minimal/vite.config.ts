import react from "@vitejs/plugin-react";
import unocss from "unocss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  clearScreen: false,
  build: {
    minify: false,
    sourcemap: true,
  },
  plugins: [unocss(), react()],
});
