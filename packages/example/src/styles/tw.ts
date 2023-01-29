import { createApi } from "@hiogawa/unocss-typescript-dsl";
import type { Api } from "./tw-api";

// `createApi` itself is so tiny, so it doesn't matter whether we eliminate it from bundle
export const tw = createApi() as Api;
