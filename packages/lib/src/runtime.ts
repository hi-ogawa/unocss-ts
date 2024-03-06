import { tinyassert } from "@hiogawa/utils";
import {
  PROP_CUSTOM_RULE,
  PROP_CUSTOM_VARIANT,
  PROP_TO_STRING,
} from "./common";

// interface merging to fill types
export interface RuntimeType {}

export const tw: RuntimeType = /* #__PURE__ */ createRuntime();

// based on https://github.com/Mokshit06/typewind/blob/1526e6c086ca6607f0060ce8ede66474585efde4/packages/typewind/src/evaluate.ts
export function createRuntime() {
  return new Proxy(
    {},
    {
      get(_target, prop: string) {
        // instantiate clean instance on first property access
        const apiInternal = createRuntimeInternal();
        // @ts-expect-error requires any
        return apiInternal[prop];
      },
    },
  );
}

function createRuntimeInternal() {
  // accumulate css classes by intercepting a property access
  let result: string[] = [];
  const getResult = () => result.join(" ");

  const proxy: unknown = new Proxy(
    {
      // support "reasonable" conversion since otherwise it would be too easy to throw (and crash vite dev server) even with simple typo
      // especially because typescript doesn't catch implic coercion https://github.com/microsoft/TypeScript/issues/30239

      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/toPrimitive
      [Symbol.toPrimitive](hint: unknown): string {
        tinyassert(hint === "string" || hint === "default");
        return getResult();
      },

      toString(): string {
        return getResult();
      },

      valueOf(): string {
        return getResult();
      },
    },
    {
      get(target, prop: unknown) {
        // @ts-expect-error string or symbol
        if (prop in target) {
          // @ts-expect-error A spread argument must either have a tuple type or be passed to a rest parameter
          return Reflect.get(...arguments);
        }

        tinyassert(typeof prop === "string");

        if (prop === PROP_TO_STRING) {
          return result.join(" ");
        }

        //
        // accumulate css classes
        //

        // handle custom rule e.g. tw._("bg-[#123]")
        if (prop === PROP_CUSTOM_RULE) {
          return (raw: unknown) => {
            tinyassert(typeof raw === "string");
            result.push(raw);
            return proxy;
          };
        }

        // handle custom variant e.g. tw._v("aria-selected", ...)
        if (prop === PROP_CUSTOM_VARIANT) {
          return (raw: unknown, inner: unknown) => {
            tinyassert(typeof raw === "string");
            // @ts-expect-error requires any
            inner = inner[PROP_TO_STRING];
            result.push(`${raw}:(${inner})`);
            return proxy;
          };
        }

        // convert back to hyphen (TODO: does this roundtrip acculately?)
        prop = prop.replaceAll("_", "-");

        return new Proxy(() => {}, {
          // variant e.g. tw.hover(...) (when called immediately, handle it as variant)
          apply(_target, _thisArg, args) {
            tinyassert(args.length === 1);
            const inner = args[0][PROP_TO_STRING];
            result.push(`${prop}:(${inner})`);
            return proxy;
          },

          // rule e.g. tw.flex (when property is accessed without call, handle it as rule)
          get(_target, next_prop: unknown) {
            tinyassert(typeof prop === "string");
            result.push(prop);
            // @ts-expect-error requires any
            return proxy[next_prop];
          },
        });
      },
    },
  );

  return proxy;
}
