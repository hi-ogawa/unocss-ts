## todo

- unocss transform via `eval`
- handle `DEFAULT` (e.g. `blue_DEFAULT` should be just `blue`)
  - https://github.com/unocss/unocss/blob/f1957bfbd70aa8ffc8dcb57da36771b7af7ab2dd/packages/preset-mini/src/_theme/colors.ts#L339
- handle `prefix` config?
- perf
  - probably string literal union is exploding e.g. `Theme_colors`
  - allow manual optimization? (e.g. shrink `colors`)
- dx
  - "interface merging" to locally allow patching unsupported cases
