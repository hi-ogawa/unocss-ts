import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/runtime.ts", "src/cli.ts", "src/cli-v2.ts"],
  format: ["esm"],
  dts: true,
});
