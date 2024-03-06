import MagicString from "magic-string";
import { describe, expect, it } from "vitest";
import { createRegex, transformMagicString } from "./transform";

function transform(s: string) {
  return transformMagicString(new MagicString(s)).toString();
}

describe("transform", () => {
  it("basic", () => {
    const input = `\
       ___(tw.flex.justify_center.items_center.$).___;
`;
    const output = transform(input);
    expect(output).toMatchInlineSnapshot(`
      "       ___("flex justify-center items-center").___;
      "
    `);
  });

  it("example", () => {
    const input = `
      <div className={tw.flex.flex_col.gap_4.$}>
        <header className={tw.flex.items_center.p_2.px_4.shadow_md.$}>
          <h1 className={tw.text_xl.$}>Example App</h1>
          <span className={tw.flex_1.$}></span>
          <a
            className={tw.i_ri_github_line.w_6.h_6.hover(tw.text_primary).$}
            href="https://github.com/hi-ogawa/unocss-ts"
          ></a>
        </header>
        <main className={tw.flex_1.flex.flex_col.items_center.px_2.$}>
          <div className={tw.w_full.max_w_xl.border.flex.flex_col.gap_2.p_2.$}>
            <h2 className={tw.text_lg.$}>Some header</h2>
            <div className={tw.text_red_500.$}>Some red text...</div>
            <div className={tw.text_blue_500.$}>Some blue text...</div>
            <button className={tw.btn.p_1.$}>Some button</button>
          </div>
        </main>
      </div>
    `;
    expect(transform(input)).toMatchInlineSnapshot(`
      "
            <div className={"flex flex-col gap-4"}>
              <header className={"flex items-center p-2 px-4 shadow-md"}>
                <h1 className={"text-xl"}>Example App</h1>
                <span className={"flex-1"}></span>
                <a
                  className={"i-ri-github-line w-6 h-6 hover:(text-primary)"}
                  href="https://github.com/hi-ogawa/unocss-ts"
                ></a>
              </header>
              <main className={"flex-1 flex flex-col items-center px-2"}>
                <div className={"w-full max-w-xl border flex flex-col gap-2 p-2"}>
                  <h2 className={"text-lg"}>Some header</h2>
                  <div className={"text-red-500"}>Some red text...</div>
                  <div className={"text-blue-500"}>Some blue text...</div>
                  <button className={"btn p-1"}>Some button</button>
                </div>
              </main>
            </div>
          "
    `);
  });

  it("global", () => {
    const input = `\
       ___(tw.flex.justify_center.items_center.$).___;

       ___(tw.flex.flex_col.justify_end.$).___;
`;
    const output = transform(input);
    expect(output).toMatchInlineSnapshot(`
      "       ___("flex justify-center items-center").___;

             ___("flex flex-col justify-end").___;
      "
    `);
  });

  it("multiline", () => {
    const input = `\
       ___(tw.flex.
        justify_center
        .items_center.$).___;
`;
    const output = transform(input);
    expect(output).toMatchInlineSnapshot(`
      "       ___("flex justify-center items-center").___;
      "
    `);
  });

  it("nested", () => {
    const input = `\
       ___(
        tw.animate_spin
          .sm(tw.hidden)
          .md(tw.inline.text_red_500.disabled(tw.text_gray_500)).$
      ).___;
`;
    const output = transform(input);
    expect(output).toMatchInlineSnapshot(`
      "       ___(
              "animate-spin sm:(hidden) md:(inline text-red-500 disabled:(text-gray-500))"
            ).___;
      "
    `);
  });
});

describe("debug-regex", () => {
  it("global", () => {
    const input = `\
       ___(tw.flex.justify_center.items_center.$).___;

       ___(tw.flex.flex_col.justify_end.$).___;
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
       ___(tw.flex.
        justify_center
        .items_center.$).___;
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
       ___(
        tw.animate_spin
          .sm(tw.hidden)
          .md(tw.inline.text_red_500.disabled(tw.text_gray_500)).$
      ).___;
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
