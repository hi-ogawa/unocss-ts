import { tw } from "./styles/tw";

export function App() {
  return (
    <div className={tw.flex.flex_col.gap_4.$}>
      <header className={tw.flex.items_center.p_2.px_4.shadow_md.$}>
        <h1 className={tw.text_xl.$}>Example App</h1>
        <span className={tw.flex_1.$}></span>
        <a
          className={tw.i_ri_github_line.w_6.h_6.hover(tw.text_primary).$}
          href="https://github.com/hi-ogawa/unocss-typescript-dsl"
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
  );
}
