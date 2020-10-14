export const clampString = (str: string, len = 30) => {
  if (str.length <= len) {
    return str;
  }
  return str.substr(0, len - 3) + "...";
};

export const newId = (kind: string): string => {
  const str = Math.random().toString(36);
  return `${kind}_${str.substr(2, 8)}`;
};

export const isInterpolatable = (
  v: unknown
): v is string | number | boolean => {
  if (v === undefined) {
    return false;
  }
  const vType = typeof v;
  return vType === "string" || vType === "number" || vType === "boolean";
};

export const isFunction = (f: unknown): f is Function =>
  f && typeof f === "function";

export const isNumber = (n: unknown): n is number => typeof n === "number";

export const isArray = (n: unknown): n is any[] =>
  n && (n as any).length !== undefined;
