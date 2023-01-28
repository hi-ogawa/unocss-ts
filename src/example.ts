import type { Api } from "./generated";

declare let tw: Api;

// basic
tw.flex.justify_center.items_center;

// variant
tw.animate_spin.sm(tw.hidden);

// user-defined shortcut
tw.btn.disabled(tw.text_red_600.bg_red_50);

// custom
tw._("bg-[#123]")._V("aria-selected", tw.bg_gray_100);
