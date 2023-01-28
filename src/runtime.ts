import { tinyassert } from "@hiogawa/utils";

// escape hatch to allow arbitrary value
export const CUSTOM_RULE = "_";
export const CUSTOM_VARIANT = "_V";

// based on https://github.com/Mokshit06/typewind/blob/1526e6c086ca6607f0060ce8ede66474585efde4/packages/typewind/src/evaluate.ts
export function createApi() {
  return new Proxy(
    {},
    {
      get(_target, prop: string) {
        // instantiate clean instance on first property access
        const apiInternal = createApiIntenal();
        // @ts-expect-error requires any
        return apiInternal[prop];
      },
    }
  );
}

function createApiIntenal() {
  // accumulate css classes by intercepting a property access
  let result: string[] = [];

  const proxy: unknown = new Proxy(
    {},
    {
      get(_target, prop: unknown) {
        // emit final result via either `toString` or `Symbol.toPrimitive` https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/toPrimitive
        if (prop === "toString") {
          return () => result.join(" ");
        }
        if (prop === Symbol.toPrimitive) {
          return (hint: unknown) => {
            tinyassert(hint === "string");
            return result.join(" ");
          };
        }

        //
        // accumulate css classes
        //

        // handle custom rule e.g. tw._("bg-[#123]")
        if (prop === CUSTOM_RULE) {
          return (raw: unknown) => {
            tinyassert(typeof raw === "string");
            result.push(raw);
            return proxy;
          };
        }

        // handle custom variant e.g. tw._V("aria-selected", ...)
        if (prop === CUSTOM_VARIANT) {
          return (raw: unknown, inner: unknown) => {
            tinyassert(typeof raw === "string");
            result.push(`${raw}(${inner})`); // invoke `toString/toPrimitive` on inner api
            return proxy;
          };
        }

        // convert back to hyphen (TODO: does this roundtrip acculately?)
        tinyassert(typeof prop === "string");
        prop = prop.replaceAll("_", "-");

        return new Proxy(
          // variant e.g. tw.hover(...) (when called immediately, handle it as variant)
          (inner: unknown) => {
            result.push(`${prop}(${inner})`); // invoke `toString/toPrimitive` on inner api
            return proxy;
          },
          {
            // rule e.g. tw.flex (when property is accssed without call, handle it as rule)
            get(_target, next_prop: unknown) {
              tinyassert(typeof prop === "string");
              result.push(prop);
              // @ts-expect-error requires any
              return proxy[next_prop];
            },
          }
        );
      },
    }
  );

  return proxy;
}
