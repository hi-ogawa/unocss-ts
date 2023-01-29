import { describe, expect, it } from "vitest";
import { createRegex, transform } from "./transform";

// example inputs are copied from src/runtime.test.ts

describe("transform", () => {
  it("basic", () => {
    const input = `\
      expect(tw.flex.justify_center.items_center.$).toMatchInlineSnapshot(xxx);
`;
    const output = transform(input);
    expect(output).toMatchInlineSnapshot(`
      "      expect(\\"(TODO)\\").toMatchInlineSnapshot(xxx);
      "
    `);
  });

  it("global", () => {
    const input = `\
      const tw = createApi() as Api;

      expect(tw.flex.justify_center.items_center.$).toMatchInlineSnapshot(xxx);

      expect(tw.flex.flex_col.justify_end.$).toMatchInlineSnapshot(xxx);
`;
    const output = transform(input);
    expect(output).toMatchInlineSnapshot(`
      "      const tw = createApi() as Api;

            expect(\\"(TODO)\\").toMatchInlineSnapshot(xxx);

            expect(\\"(TODO)\\").toMatchInlineSnapshot(xxx);
      "
    `);
  });

  it("multiline", () => {
    const input = `\
      expect(tw.flex.
        justify_center
        .items_center.$).toMatchInlineSnapshot(xxx);
`;
    const output = transform(input);
    expect(output).toMatchInlineSnapshot(`
      "      expect(\\"(TODO)\\").toMatchInlineSnapshot(xxx);
      "
    `);
  });

  it("nested", () => {
    const input = `\
      expect(
        tw.animate_spin
          .sm(tw.hidden)
          .md(tw.inline.text_red_500.disabled(tw.text_gray_500)).$
      ).toMatchInlineSnapshot(xxx);
`;
    const output = transform(input);
    expect(output).toMatchInlineSnapshot(`
      "      expect(
              \\"(TODO)\\"
            ).toMatchInlineSnapshot(xxx);
      "
    `);
  });
});

describe("debug-regex", () => {
  it("global", () => {
    const input = `\
      const tw = createApi() as Api;

      expect(tw.flex.justify_center.items_center.$).toMatchInlineSnapshot(xxx);

      expect(tw.flex.flex_col.justify_end.$).toMatchInlineSnapshot(xxx);
`;
    const regex = createRegex("tw", "$");
    expect([...input.matchAll(regex)]).toMatchInlineSnapshot(`
      [
        [
          "tw.flex.justify_center.items_center.$",
        ],
        [
          "tw.flex.flex_col.justify_end.$",
        ],
      ]
    `);
  });

  it("multiline", () => {
    const input = `\
      expect(tw.flex.
        justify_center
        .items_center.$).toMatchInlineSnapshot(xxx);
`;
    const regex = createRegex("tw", "$");
    expect([...input.matchAll(regex)]).toMatchInlineSnapshot(`
      [
        [
          "tw.flex.
              justify_center
              .items_center.$",
        ],
      ]
    `);
  });

  it("nested", () => {
    const regex = createRegex("tw", "$");
    const input = `\
      expect(
        tw.animate_spin
          .sm(tw.hidden)
          .md(tw.inline.text_red_500.disabled(tw.text_gray_500)).$
      ).toMatchInlineSnapshot(xxx);
`;
    expect([...input.matchAll(regex)]).toMatchInlineSnapshot(`
      [
        [
          "tw.animate_spin
                .sm(tw.hidden)
                .md(tw.inline.text_red_500.disabled(tw.text_gray_500)).$",
        ],
      ]
    `);
  });
});
