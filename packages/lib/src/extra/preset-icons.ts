import fs from "node:fs";
import { tinyassert } from "@hiogawa/utils";
import { resolveModule } from "local-pkg";
import type { DynamicRule } from "unocss";
import { dummyRule } from "./dummy";

// sync version of https://github.com/iconify/iconify/blob/c04eb0dbb0296980997720378d5b00460aece7ba/packages/utils/src/loader/fs.ts
export function dummyPresetIconsRules(
  collectionNames: string[],
  prefix: string = "i-",
): DynamicRule[] {
  let names: string[] = [];
  for (const colName of collectionNames) {
    // https://docs.iconify.design/types/iconify-json.html
    const iconsJsonPath = resolveModule(`@iconify-json/${colName}/icons.json`);
    tinyassert(iconsJsonPath, `iconify collection not found '${colName}'`);
    const iconsJson = JSON.parse(fs.readFileSync(iconsJsonPath, "utf-8"));
    for (const icon of Object.keys(iconsJson.icons)) {
      names.push(`${prefix}${iconsJson.prefix}-${icon}`);
    }
  }
  return names.map(dummyRule);
}
