# unocss-ts

Adapting the idea of [Typewind](https://github.com/Mokshit06/typewind) to [UnoCSS](https://github.com/unocss/unocss).

Notable differences are:

- No babel dependency since the modified DSL is simple enough to allow regex-based transform.
- The runtime itself is not tied to uno config and thus the same DSL can be used anywhere (e.g. when defining `shortcuts` inside `uno.config.ts`).

See `packages/example` for the example vite app.

The auto-generated typescript DSL is found at [`packages/example/src/styles/tw-api.ts`](packages/example/src/styles/tw-api.ts).

```sh
# development
pnpm i
pnpm test

# run example
pnpm build
pnpm example:generate  # re-generate tw-api.ts
pnpm example:dev
```

<details>
<summary>Reveal example code</summary>

```tsx
// packages/example/src/app.tsx

import { tw } from "./styles/tw";

export function App() {
  return (
    <div className={tw.flex.flex_col.gap_4.$}>
      <header className={tw.flex.items_center.p_2.px_4.shadow_md.$}>
        <h1 className={tw.text_xl.$}>Example App</h1>
        <span className={tw.flex_1.$}></span>
        <a
          className={tw._("i-ri-github-line w-6 h-6").hover(tw.text_primary).$}
          href="https://github.com/hi-ogawa/unocss-ts"
        ></a>
      </header>
      <main className={tw.flex_1.flex.flex_col.items_center.px_2.$}>
        <div
          className={
            tw._("w-full").max_w_xl._("border").flex.flex_col.gap_2.p_2.$
          }
        >
          <h2 className={tw.text_lg.$}>Some header</h2>
          <div className={tw.text_red_500.$}>Some red text...</div>
          <div className={tw.text_blue_500.$}>Some blue text...</div>
          <button className={tw.btn.p_1.$}>Some button</button>
        </div>
      </main>
    </div>
  );
}
```

</details>

![image](https://user-images.githubusercontent.com/4232207/215325254-6012680e-4f3a-4b11-834b-bf8c7eb055eb.png)
