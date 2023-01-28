// npx tsx src/experiment.mts

import { loadConfig } from "@unocss/config";

// patched to expose internal @unocss/shared-integration
// https://github.com/unocss/unocss/blob/2e74b31625bbe3b9c8351570749aa2d3f799d919/packages/shared-integration/src/context.ts
import { createContext } from "@unocss/cli";

async function main() {
  const config = await loadConfig();
  console.log(config);

  const ctx = await createContext();
  await ctx.ready;
  console.log(ctx);
  console.log(ctx.uno);
  ctx.uno.config.rulesSize;
  ctx.uno.config.rulesDynamic;
  ctx.uno.config.rulesStaticMap;
  ctx.uno.config.variants;
  ctx.uno.config.theme;
}

main();
