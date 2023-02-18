import { createRuntime } from "@hiogawa/unocss-typescript-dsl/dist/runtime";
import type { Api } from "./tw-api";

// runtime is so tiny and with no dependency, so it doesn't matter whether we eliminate it from bundle
export const tw = createRuntime() as Api;
