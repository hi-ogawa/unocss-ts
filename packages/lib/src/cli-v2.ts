import fs from "node:fs";
import { TinyCli, arg, tinyCliMain } from "@hiogawa/tiny-cli";
import { version as packageVersion } from "../package.json";
import { transform } from "./transform";

const cli = new TinyCli({
  program: "unocss-typescript-dsl-pre",
  version: packageVersion,
});

cli.defineCommand(
  {
    name: "transform",
    args: {
      files: arg.stringArray("Input files to apply transform"),
    },
  },
  async ({ args }) => {
    for (const file of args.files) {
      try {
        const changed = await transformFile(file);
        console.log(changed ? "✅" : "ℹ️", file);
      } catch (e) {
        console.log("❌", file, String(e));
        process.exitCode = 1;
      }
    }
  }
);

async function transformFile(file: string): Promise<boolean> {
  const input = await fs.promises.readFile(file, "utf-8");
  const output = transform(input);
  if (input === output) {
    return false;
  }
  await fs.promises.writeFile(file, output);
  return true;
}

tinyCliMain(cli);
