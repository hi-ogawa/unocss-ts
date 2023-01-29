import { tw } from "./styles/tw";

export function App() {
  return (
    <div className={tw.flex.flex_col.gap_4.$}>
      <header className={tw.flex.items_center.p_2.px_4.shadow_md.$}>
        <h1 className={tw.text_xl.$}>Example App</h1>
        <span className={tw.flex_1.$}></span>
        <a
          className={tw._("i-ri-github-line w-6 h-6").hover(tw.text_primary).$}
          href="https://github.com/hi-ogawa/unocss-typescript-dsl"
        ></a>
      </header>
      <main className={tw.flex_1.flex.flex_col.items_center.px_2.$}>
        <div
          className={
            tw._("w-full").max_w_xl._("border").flex.flex_col.gap_2.p_2.$
          }
        >
          <h2 className={tw.text_lg.$}>Some header</h2>
          <div className={tw.text_red_500.$}>Some text...</div>
          <button className={tw.btn.p_1.$}>Some button</button>
        </div>
      </main>
    </div>
  );
}
