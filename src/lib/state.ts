export type AnyObj = Record<string, any>;

export function setDeep(obj: AnyObj, path: string, value: any): AnyObj {
  const parts = path.split(".");
  const out = { ...obj };
  let cur: AnyObj = out;

  for (let i = 0; i < parts.length - 1; i++) {
    const p = parts[i];
    cur[p] = typeof cur[p] === "object" && cur[p] !== null ? { ...cur[p] } : {};
    cur = cur[p];
  }

  cur[parts[parts.length - 1]] = value;
  return out;
}
