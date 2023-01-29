# unocss typescript DSL

adapting the idea of [typewind](https://github.com/Mokshit06/typewind) to [unocss](https://github.com/unocss/unocss).

notable differences are:

- no babel dependency since the modified DSL is simple enough to allow regex-based transform.
- the runtime itself is not tied to uno config and thus DSL can be used anywhere (e.g. when defining `shortcuts`).

see `packages/example` for the usage.

```sh
# development
pnpm i
pnpm test

# run example
pnpm build
pnpm example:generate  # re-generate tw-api.ts
pnpm example:dev
```

![image](https://user-images.githubusercontent.com/4232207/215319120-e444f0de-79c2-4083-a7f8-109fd0924e53.png)
