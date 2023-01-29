# unocss typescript DSL (wip)

adapting the idea of [typewind](https://github.com/Mokshit06/typewind) to [unocss](https://github.com/unocss/unocss).

see `packages/example` for the usage.

```sh
# development
pnpm i
npx tsx src/cli.ts --out-file src/generated.ts --filter-colors '@(gray|blue|red)-*'
pnpm test
```
