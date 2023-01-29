import { tinyassert } from "@hiogawa/utils";
import { describe, expect, it } from "vitest";
import { generateApi } from "./generate-api";

describe("generateApi", () => {
  it("basic", async () => {
    const output = await generateApi({
      optimize: {
        filterColors: ["@(gray|blue)-*"],
      },
    });
    const match = output.match(/export type Theme_colors =(.*?);/ms);
    tinyassert(match);
    expect(match[0]).toMatchInlineSnapshot(`
      "export type Theme_colors =
        | \`inherit\`
        | \`current\`
        | \`transparent\`
        | \`black\`
        | \`white\`
        | \`blue_1\`
        | \`blue_2\`
        | \`blue_3\`
        | \`blue_4\`
        | \`blue_5\`
        | \`blue_6\`
        | \`blue_7\`
        | \`blue_8\`
        | \`blue_9\`
        | \`blue_50\`
        | \`blue_100\`
        | \`blue_200\`
        | \`blue_300\`
        | \`blue_400\`
        | \`blue_500\`
        | \`blue_600\`
        | \`blue_700\`
        | \`blue_800\`
        | \`blue_900\`
        | \`blue_DEFAULT\`
        | \`gray_1\`
        | \`gray_2\`
        | \`gray_3\`
        | \`gray_4\`
        | \`gray_5\`
        | \`gray_6\`
        | \`gray_7\`
        | \`gray_8\`
        | \`gray_9\`
        | \`gray_50\`
        | \`gray_100\`
        | \`gray_200\`
        | \`gray_300\`
        | \`gray_400\`
        | \`gray_500\`
        | \`gray_600\`
        | \`gray_700\`
        | \`gray_800\`
        | \`gray_900\`
        | \`gray_DEFAULT\`
        | \`primary\`;"
    `);
  });
});
