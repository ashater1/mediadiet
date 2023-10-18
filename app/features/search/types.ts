import { z } from "zod";

const searchForTypes = ["movies", "books", "tv"] as const;
export type SearchTypes = (typeof searchForTypes)[number];

export const noSearchTermError = {
  success: false,
  error: new z.ZodError([
    { code: "custom", path: [0], message: "Missing search term" },
  ]),
};
