import { MediaType } from "@prisma/client";
import { z } from "zod";

const entryTypesEnum = z.array(z.enum(["BOOK", "MOVIE", "TV"]));

const entryTypesArraySchema = z
  .array(z.string().toUpperCase())
  .pipe(entryTypesEnum);

export function getMediaTypesFromUrl(url: string): MediaType[] {
  //   Check if url has filters & filter data if it does
  const _url = new URL(url);
  const entryTypes = _url.searchParams.getAll("type");
  const parsedEntryTypes = entryTypesArraySchema.parse(entryTypes);

  if (!parsedEntryTypes.length) {
    return [MediaType.BOOK, MediaType.MOVIE, MediaType.TV];
  }

  return parsedEntryTypes;
}

export function getCoverArt({
  id,
  mediaType,
}: {
  id: string;
  mediaType: MediaType;
}) {
  return mediaType === "BOOK"
    ? `https://covers.openlibrary.org/b/id/${id}-L.jpg`
    : `https://image.tmdb.org/t/p/w342${id}`;
}
