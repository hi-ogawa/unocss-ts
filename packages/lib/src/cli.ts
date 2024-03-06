import fs from "node:fs";
import { TinyCli, arg, tinyCliMain } from "@hiogawa/tiny-cli";
import { version as packageVersion } from "../package.json";
import { generateApi } from "./generate-api";
import { transformString } from "./transform";

const cli = new TinyCli({
  program: "unocss-ts",
  version: packageVersion,
});

cli.defineCommand(
  {
    name: "generate",
    args: {
      outFile: arg.string("Output .d.ts file", { optional: true }),
      configFile: arg.string("UnoCSS config file", { optional: true }),
    },
  },
  async ({ args }) => {
    let output = await generateApi({
      cwd: process.cwd(),
      configFile: args.configFile,
      skipNonTailwind: true,
    });
    output = output.trimEnd() + "\n"; // fix trailing new lines
    if (args.outFile) {
      await fs.promises.writeFile(args.outFile, output);
    } else {
      process.stdout.write(output);
    }
  },
);

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
  },
);

async function transformFile(file: string): Promise<boolean> {
  const input = await fs.promises.readFile(file, "utf-8");
  const output = transformString(input);
  if (input === output) {
    return false;
  }
  await fs.promises.writeFile(file, output);
  return true;
}

tinyCliMain(cli);
