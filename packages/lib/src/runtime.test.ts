import { describe, expect, it } from "vitest";
import { createRuntime } from "./runtime";

describe("runtime", () => {
  it("basic", () => {
    const tw = createRuntime() as any;

    expect(tw.flex.justify_center.items_center.$).toMatchInlineSnapshot(
      '"flex justify-center items-center"'
    );

    expect(tw.flex.flex_col.justify_end.$).toMatchInlineSnapshot(
      '"flex flex-col justify-end"'
    );
  });

  it("variant", () => {
    const tw = createRuntime() as any;
    expect(
      tw.animate_spin.sm(tw.hidden).md(tw.inline.text_red_500).$
    ).toMatchInlineSnapshot(
      '"animate-spin sm:(hidden) md:(inline text-red-500)"'
    );

    expect(
      tw.animate_spin
        .sm(tw.hidden)
        .md(tw.inline.text_red_500.disabled(tw.text_gray_500)).$
    ).toMatchInlineSnapshot(
      '"animate-spin sm:(hidden) md:(inline text-red-500 disabled:(text-gray-500))"'
    );
  });

  it("user-defined", () => {
    const tw = createRuntime() as any;
    expect(tw.text_primary.bg_white.$).toMatchInlineSnapshot(
      '"text-primary bg-white"'
    );
  });

  it("custom rule", () => {
    const tw = createRuntime() as any;
    expect(
      tw.text_gray_500._("bg-[#123]")._("border-[#456]").$
    ).toMatchInlineSnapshot('"text-gray-500 bg-[#123] border-[#456]"');
  });

  it("custom variant", () => {
    const tw = createRuntime() as any;
    expect(
      tw.bg_white._v("aria-selected", tw.bg_gray_100.text_blue_600).$
    ).toMatchInlineSnapshot(
      '"bg-white aria-selected:(bg-gray-100 text-blue-600)"'
    );
  });

  describe("coercion", () => {
    it("String", () => {
      const tw = createRuntime() as any;
      expect(String(tw.flex.justify_center.items_center)).toMatchInlineSnapshot(
        '"flex justify-center items-center"'
      );
    });

    it("interpolation", () => {
      const tw = createRuntime() as any;
      expect(`${tw.flex.justify_center.items_center}`).toMatchInlineSnapshot(
        '"flex justify-center items-center"'
      );
    });

    it("toString", () => {
      const tw = createRuntime() as any;
      expect(
        tw.flex.justify_center.items_center.toString()
      ).toMatchInlineSnapshot('"flex justify-center items-center"');
    });
  });
});
