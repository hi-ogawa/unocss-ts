import fs from "node:fs";
import { cac } from "cac";
import { GenerateApiOptions, generateApi } from "./generate-api";

const cli = cac("unocss-typescript-dsl");

cli
  .help()
  .command("", "generate typescript api")
  .option("-o, --out-file <file>", "Output typescript file", { default: "-" })
  .option("-c, --config-file <file>", "Unocss config file")
  .option("--cwd <directory>", "Project directory")
  .option(
    "--filter-colors <minimatch-pattern>",
    "Filter theme colors for performance"
  )
  .action(async (args: any) => {
    const options: GenerateApiOptions = {
      cwd: args.cwd,
      configPath: args.configFile,
      optimize: {
        filterColors: args.filterColors
          ? [args.filterColors].flat()
          : undefined,
      },
    };
    const output = await generateApi(options);
    if (args.outFile === "-") {
      console.log(output);
    } else {
      await fs.promises.writeFile(args.outFile, output);
    }
  });

async function main() {
  cli.parse(undefined, { run: false });
  await cli.runMatchedCommand();
}

// TODO: handle error https://github.com/unocss/unocss/blob/f1957bfbd70aa8ffc8dcb57da36771b7af7ab2dd/packages/cli/src/cli.ts#L4-L5
main();
