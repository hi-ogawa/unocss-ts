import { tw } from "./styles/tw";

export function App() {
  return (
    <div className={tw.flex.flex_col.gap_2.$}>
      <header className={tw.flex.items_center.p_2.px_4.$}>
        <h1 className={tw.text_xl.$}>Example</h1>
        <span className={tw.flex_1.$}></span>
        <a
          className={tw.hover(tw.text_primary).$}
          href="https://github.com/hi-ogawa/unocss-typescript-dsl"
        >
          <span className={tw._("i-ri-github-line w-6 h-6").$} />
        </a>
      </header>
      <main className={tw.flex_1.flex.flex_col.items_center.$}>
        <div
          className={
            tw._("w-full").max_w_xl._("border").flex.flex_col.gap_2.p_2.$
          }
        >
          <h2 className={tw.text_lg.$}>Some Card</h2>
          <div>Some message</div>
        </div>
      </main>
    </div>
  );
}
