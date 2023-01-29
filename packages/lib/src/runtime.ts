import { tinyassert } from "@hiogawa/utils";

// TODO: configurable
export const API_NAME = "tw";
export const PROP_CUSTOM_RULE = "_";
export const PROP_CUSTOM_VARIANT = "_v";
export const PROP_TO_STRING = "$";

//
// Api definition (i.e. typescript dsl)
//

export const API_DEFINITION = `\
type Property = RuleStatic | RuleDynamic | Shortcut;
type Method = Variant;

type ApiProperty = {
  [key in Property]: Api;
};

type ApiMethod = {
  [key in Method]: (inner: Api) => Api;
};

// escape hatch to allow arbitrary values which are not supported by auto-generation
type ApiCustom = {
  _: (raw: string) => Api; // for rule
  _v: (raw: string, inner: Api) => Api; // for variant
};

// force special property to dump the resulting class string,
// which allows transform to be implemented trivially via regex
type ApiToString = {
  $: string;
};

export type Api = ApiProperty & ApiMethod & ApiCustom & ApiToString;
`;

//
// Api runtime implementation
//

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

        // handle custom variant e.g. tw._V("aria-selected", ...)
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

        return new Proxy(
          // variant e.g. tw.hover(...) (when called immediately, handle it as variant)
          (inner: unknown) => {
            // @ts-expect-error requires any
            inner = inner[PROP_TO_STRING];
            result.push(`${prop}:(${inner})`);
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
