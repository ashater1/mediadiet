import { redirect } from "@vercel/remix";

export function convertStringToBool(value: FormDataEntryValue) {
  if (typeof value !== "string")
    throw new Error(`Must provide a string - not ${typeof value}`);
  if (value.toLowerCase() === "true") return true;
  if (value.toLowerCase() === "false") return false;
  if (value.toLowerCase() === "") return null;
  throw new Error("Must provide string of true, false, or ''");
}

export function listToString(
  list: (string | null)[] | null | undefined,
  shrinkAfter: number | null = null
) {
  if (!Array.isArray(list) || !list.length) return "";

  let _list = safeFilter(list);

  if (!shrinkAfter || shrinkAfter >= list.length) {
    if (_list.length === 1) return _list[0];

    if (_list.length === 2) {
      const listtring = _list.join(" & ");
      return listtring;
    }
    const allButLast = _list.slice(0, -1).join(", ");
    const last = _list.slice(-1);
    return `${allButLast}, & ${last}`;
  } else {
    const shownItems = _list.slice(0, shrinkAfter);
    const truncated = _list.slice(shrinkAfter, _list.length).length;
    return `${shownItems.join(", ")} & ${truncated} ${
      truncated > 1 ? "others" : "other"
    }`;
  }
}

export function safeFilter<T>(array: (T | null | undefined)[]): T[] {
  return array.filter((item) => item !== null && item !== undefined) as T[];
}

const primitives: Record<string, any> = {
  null: null,
  undefined: undefined,
  true: true,
  false: false,
};

export function paramsToObject(params: URLSearchParams) {
  let obj: Record<string, any> = {};

  for (const [key, value] of params) {
    const _value = value in primitives ? primitives[value] : value;
    obj[key] ??= [];
    obj[key].push(_value);
  }

  return obj;
}

export async function delay(milliseconds: number = 1000) {
  return new Promise((res) => setTimeout(() => res(""), milliseconds));
}

export function defaultRedirect({ url = "/" }: { url?: string }) {
  redirect(url);
}
