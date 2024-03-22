import { MediaType } from "@prisma/client";
import { z } from "zod";
import { openlibrary } from "~/features/books/openLibrary";
import { movieDb } from "~/features/tvAndMovies";

export type AddToListArgs = z.infer<typeof AddToListSchema>;

export const AddToListSchema = z.discriminatedUnion("mediaType", [
  z.object({
    userId: z.string(),
    mediaType: z.literal("MOVIE"),
    apiId: z.string(),
  }),
  z.object({
    userId: z.string(),
    mediaType: z.literal("BOOK"),
    apiId: z.string(),
    releaseYear: z.string().nullish().default(null),
  }),
  z.object({
    userId: z.string(),
    mediaType: z.literal("TV"),

    apiId: z.string(),
    seasonId: z.string(),
  }),
]);

export async function addNewEntry({ userId, mediaType, apiId }: AddToListArgs) {
  if (mediaType === "BOOK") {
    const book = openlibrary.getBook(apiId);
  } else if (mediaType === "MOVIE") {
    const movie = await movieDb.getMovie(apiId);
  } else if (mediaType === "TV") {
    const tv = await movieDb.getShow(apiId);
  }
}
