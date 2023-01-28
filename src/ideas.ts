// TODO
// - auto-generate Api and apiImpl based on unocss's rule autocomplete annotation
// - requires transform before unocss scanning the source

// ## todo
// - hard to handle "prefix" config?
// - allow the usage e.g. when defining shortcuts
// - typescript cannot autocomplete `border_${number}`
//   - pre-generate with configured range of numbers? (integers, small fractions, ...)
// - how to support arbitrary values? e.g. `width-[200px]`
// - fractional number e.g. `m-1.5` will require quoted property e.g. `tw["m_1.5"]`
// - should be able to fallback to string literal from anywhere e.g.
//   - `tw.hover("bg-[#123456]")`

//
// autocomplete
//

// https://github.com/unocss/unocss/blob/2e74b31625bbe3b9c8351570749aa2d3f799d919/packages/autocomplete/src/parse.ts
type Autocomplete_num = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 24 | 36;
type Autocomplete_percent =
  | 0
  | 10
  | 20
  | 30
  | 40
  | 50
  | 60
  | 70
  | 80
  | 90
  | 100;
type Autocomplete_directions = "x" | "y" | "t" | "b" | "l" | "r";

//
// theme
//

// https://github.com/unocss/unocss/blob/2e74b31625bbe3b9c8351570749aa2d3f799d919/packages/preset-mini/src/_theme/misc.ts
type Theme_spacing = "sm" | "md" | "lg";

//
// rule
//

type Rule_text_1 = `text_${Theme_spacing}`;

type Rule_border_1 = `border_${Autocomplete_num}`;
type Rule_border_2 = `border_${Theme_spacing}`;

type Rule_m_1 = `m_${Autocomplete_num}`;
type Rule_m_2 = `m${Autocomplete_directions}_${Autocomplete_num}`;

//
// variant
//

type Variant_disabled = `disabled`;
type Variant_hover = `hover`;

//
// main api
//

type Rule = Rule_text_1 | Rule_border_1 | Rule_border_2 | Rule_m_1 | Rule_m_2;

type Variant = Variant_disabled | Variant_hover;

type Api = {
  [key in Rule]: Api;
} & {
  [key in Variant]: (api: Api) => Api;
} & {
  // allow anything as an escape hatch of DSL's limitation
  R: (raw: string) => Api; // for rule
  V: (raw: string) => (api: Api) => Api; // for variant
} & string; // allow assigning to `className` prop

//
// api implementation
//

type ApiImpl = {
  [key in Rule]: string;
} & {
  [key in Variant]: (api: string) => string;
} & {
  R: (raw: string) => string;
  V: (raw: string) => (api: string) => string;
};

// TODO: how to chain? (maybe Proxy?)
const apiImpl: Partial<ApiImpl> = {
  // Rule
  border_0: "border-0",
  // ...and more

  // Variant
  hover: (inner) => `hover:(${inner})`,
  // ...and more

  // escape hatch
  R: (raw) => raw,
  V: (raw) => (inner) => `${raw}:(${inner})`,
};

//
// example usage
//

declare let tw: Api;
let className: string = "";

className = tw.text_sm.ml_1.disabled(tw.R("bg-[#abcdef]"));
className = tw.V("aria-invalid")(tw.R("text-red"));
