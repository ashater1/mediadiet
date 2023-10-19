import { useSearchParams } from "@remix-run/react";
import xor from "lodash/xor";
import { useEffect, useReducer, useState } from "react";
import { z } from "zod";
import { paramsToObject } from "~/utils/supabase";

export type OneOfArray<T> = T extends any[] ? T[number] : T;

export type Action =
  | {
      type: "type";
      payload: "movie" | "tv" | "book";
    }
  | { type: "rating"; payload: "liked" | "disliked" | null }
  | { type: "favorited"; payload: true | false }
  | { type: "sort"; payload: "desc" | "asc" }
  | { type: "reset" };

const initial: State = {
  type: [],
  rating: [],
  favorited: [],
  sort: null,
};

const StateSchema = z.object({
  favorited: z.boolean().array().default([]),
  rating: z
    .union([z.literal("liked"), z.literal("disliked"), z.null()])
    .array()
    .default([]),
  sort: z
    .union([z.literal("asc"), z.literal("desc"), z.null()])
    .array()
    .default([])
    .transform((val) => (Array.isArray(val) ? val.at(0) : null)),
  type: z
    .union([z.literal("movie"), z.literal("book"), z.literal("tv")])
    .array()
    .optional()
    .default([]),
});

export type State = z.infer<typeof StateSchema>;

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "type":
      const newMediaType = xor([...state.type], [action.payload]);
      return { ...state, type: [...newMediaType] };

    case "rating":
      const newRating = xor([...state.rating], [action.payload]);
      return { ...state, rating: [...newRating] };

    case "favorited":
      const newFavorited = xor([...state.favorited], [action.payload]);
      return { ...state, favorited: [...newFavorited] };

    case "sort":
      return {
        ...state,
        sort: action.payload,
      };

    case "reset":
      return { ...initial, sort: state.sort ?? null };

    default:
      return { ...state };
  }
};

export function useListNav() {
  const [searchParams] = useSearchParams();
  const [state, dispatch] = useReducer(
    reducer,
    StateSchema.parse(paramsToObject(searchParams))
  );

  const [formData, setFormData] = useState<FormData>();

  useEffect(() => {
    const newForm = new FormData();

    for (const [k, v] of Object.entries(state)) {
      if (v === null) continue;
      if (!Array.isArray(v) && typeof v === "object")
        throw new Error("Only accepts arrays & primitives");
      if (Array.isArray(v)) {
        v.forEach((item) => newForm.append(k, String(item)));
      } else newForm.append(k, String(v));
    }
    setFormData(newForm);
  }, [state]);

  const getIsActive = <K extends keyof State, V extends OneOfArray<State[K]>>(
    key: K,
    value: V
  ): boolean | null => {
    const currentState = state[key] as Record<string, any>;

    if (!currentState) return null;

    return Array.isArray(currentState)
      ? currentState.includes(value)
      : currentState === value;
  };

  const getActiveFilters = () => {
    const currentState = { ...state } as Record<string, any>;
    const active: any[] = [];

    Object.keys(state).forEach((key) => {
      if (key === "sort") return;

      if (
        (Array.isArray(currentState[key]) && currentState[key].length > 0) ||
        (!Array.isArray(currentState[key]) && currentState[key])
      )
        active.push(key);
    });

    return active;
  };

  const getFilterLen = () => getLen(state, ["sort"]);

  const funcs = { getFilterLen, getIsActive, getActiveFilters };

  return { funcs, formData, state, dispatch };
}

function getLen<
  Obj extends Record<string, any>,
  ExcludeKeys extends Array<keyof Obj>
>(obj: Obj, exclude: ExcludeKeys) {
  let len = 0;

  for (const [k, v] of Object.entries(obj)) {
    if (exclude?.includes(k)) continue;
    if (Array.isArray(v)) len += v.length;
    else len++;
  }

  return len;
}
