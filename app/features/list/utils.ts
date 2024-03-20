import { MediaType } from "@prisma/client";
import { z } from "zod";

const entryTypesEnum = z.array(z.enum(["BOOK", "MOVIE", "TV"]));
const entryTypesArraySchema = z
  .array(z.string().toUpperCase())
  .pipe(entryTypesEnum);

export function getEntryTypesFromUrl(url: string): MediaType[] {
  //   Check if url has filters & filter data if it does
  const _url = new URL(url);
  const entryTypes = _url.searchParams.getAll("type");
  const parsedEntryTypes = entryTypesArraySchema.parse(entryTypes);

  if (!parsedEntryTypes.length) {
    return [MediaType.BOOK, MediaType.MOVIE, MediaType.TV];
  }

  return parsedEntryTypes;
}
