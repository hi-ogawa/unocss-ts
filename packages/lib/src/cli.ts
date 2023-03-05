import fs from "node:fs";
import { join } from "node:path";
import process from "node:process";
import { cac } from "cac";
import consola from "consola";
import { z } from "zod";
import { Z_GENERATE_API_OPTIONS, generateApi } from "./generate-api";

const cli = cac("unocss-typescript-dsl");

const Z_CLI_OPTIONS = z.object({
  stdout: z.boolean().optional(),
  outDir: z.string().optional(),
});

cli
  .help()
  .command("", "generate typescript api")
  .option(`--${Z_CLI_OPTIONS.keyof().enum.stdout}`, "print types to stdout")
  .option(
    `--${Z_CLI_OPTIONS.keyof().enum.outDir} <file>`,
    "output index.ts and types.ts files"
  )
  .option(
    `--${Z_GENERATE_API_OPTIONS.keyof().enum.cwd} <file>`,
    "project directory"
  )
  .option(
    `--${Z_GENERATE_API_OPTIONS.keyof().enum.configFile} <file>`,
    "unocss config file"
  )
  .option(
    `--${Z_GENERATE_API_OPTIONS.keyof().enum.skipNonTailwind}`,
    "filter out unocss specific redundant rules (tsc optimization)"
  )
  .action(runCliGenerate);

async function runCliGenerate(rawArgs: unknown) {
  const args = Z_CLI_OPTIONS.parse(rawArgs);
  let output = await generateApi(Z_GENERATE_API_OPTIONS.parse(rawArgs));
  output = output.trimEnd() + "\n"; // fix trailing new lines
  if (args.stdout) {
    process.stdout.write(output);
  }
  if (args.outDir) {
    if (!fs.existsSync(args.outDir)) {
      await fs.promises.mkdir(args.outDir, { recursive: true });
    }
    await fs.promises.writeFile(join(args.outDir, "types.ts"), output);
    await fs.promises.writeFile(
      join(args.outDir, "index.ts"),
      RUNTIME_FILE_OUTPUT
    );
  }
}

const RUNTIME_FILE_OUTPUT = `\
import { createRuntime } from "@hiogawa/unocss-typescript-dsl/dist/runtime";
import type { Api } from "./types";

export const tw = createRuntime() as Api;
`;

async function main() {
  try {
    cli.parse(undefined, { run: false });
    await cli.runMatchedCommand();
  } catch (e) {
    consola.error(e);
    process.exit(1);
  }
}

main();
