import { describe, expect, it } from "vitest";
import type { Api } from "./generated";
import { createApi } from "./runtime";

describe("runtime", () => {
  it("basic", () => {
    const tw = createApi() as Api;

    expect(
      tw.flex.justify_center.items_center.toString()
    ).toMatchInlineSnapshot('"flex justify-center items-center"');

    expect(tw.flex.flex_col.justify_end.toString()).toMatchInlineSnapshot(
      '"flex flex-col justify-end"'
    );

    expect(String(tw.flex.flex_col.justify_end)).toMatchInlineSnapshot(
      '"flex flex-col justify-end"'
    );
  });

  it("variant", () => {
    const tw = createApi() as Api;
    expect(
      tw.animate_spin.sm(tw.hidden).md(tw.inline.text_red_500).toString()
    ).toMatchInlineSnapshot(
      '"animate-spin sm(hidden) md(inline text-red-500)"'
    );

    expect(
      tw.animate_spin
        .sm(tw.hidden)
        .md(tw.inline.text_red_500.disabled(tw.text_gray_500))
        .toString()
    ).toMatchInlineSnapshot(
      '"animate-spin sm(hidden) md(inline text-red-500 disabled(text-gray-500))"'
    );
  });

  it("custom rule", () => {
    const tw = createApi() as Api;
    expect(
      tw.text_gray_500._("bg-[#123]")._("border-[#456]").toString()
    ).toMatchInlineSnapshot('"text-gray-500 bg-[#123] border-[#456]"');
  });

  it("custom variant", () => {
    const tw = createApi() as Api;
    expect(
      tw.bg_white._V("aria-selected", tw.bg_gray_100.text_blue_600).toString()
    ).toMatchInlineSnapshot(
      '"bg-white aria-selected(bg-gray-100 text-blue-600)"'
    );
  });
});
