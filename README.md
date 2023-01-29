# unocss typescript DSL

Adapting the idea of [typewind](https://github.com/Mokshit06/typewind) to [unocss](https://github.com/unocss/unocss).

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
pnpm i
pnpm example:generate  # re-generate tw-api.ts
pnpm example:dev
```

![image](https://user-images.githubusercontent.com/4232207/215319120-e444f0de-79c2-4083-a7f8-109fd0924e53.png)
