import { redirect } from "@vercel/remix";
import { camelCase, isArray, transform, isObject } from "lodash";

export function convertStringToBool(value: FormDataEntryValue) {
  if (typeof value !== "string")
    throw new Error(`Must provide a string - not ${typeof value}`);
  if (value.toLowerCase() === "true") return true;
  if (value.toLowerCase() === "false") return false;
  if (value.toLowerCase() === "") return null;
  throw new Error("Must provide string of true, false, or ''");
}

export function listToString(
  list: string[] | null | undefined,
  shrinkAfter: number | null = null
) {
  if (!Array.isArray(list) || !list.length) return "";

  if (!shrinkAfter || shrinkAfter >= list.length) {
    if (list.length === 1) return list[0];
    if (list.length === 2) {
      const listtring = list.join(" & ");
      return listtring;
    }
    const allButLast = list.slice(0, -1).join(", ");
    const last = list.slice(-1);
    return `${allButLast}, & ${last}`;
  } else {
    const shownItems = list.slice(0, shrinkAfter);
    const truncated = list.slice(shrinkAfter, list.length).length;
    return `${shownItems.join(", ")} & ${truncated} ${
      truncated > 1 ? "others" : "other"
    }`;
  }
}

export function safeFilter<T>(array: (T | null | undefined)[]): T[] {
  return array.filter((item) => item !== null && item !== undefined) as T[];
}

export const camelize = (obj: Record<string, unknown>) =>
  transform(
    obj,
    (result: Record<string, unknown>, value: unknown, key: string, target) => {
      const camelKey = isArray(target) ? key : camelCase(key);
      result[camelKey] = isObject(value)
        ? camelize(value as Record<string, unknown>)
        : value;
    }
  );

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
