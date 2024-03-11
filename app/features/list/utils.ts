import { z } from "zod";

const entryTypesSchema = z.array(z.enum(["book", "movie", "tv"]));

export function getEntryTypesFromUrl(url: string) {
  //   Check if url has filters & filter data if it does
  const _url = new URL(url);
  const entryTypes = _url.searchParams.getAll("type");
  const parsedEntryTypes = entryTypesSchema.parse(entryTypes);
  return parsedEntryTypes;
}
