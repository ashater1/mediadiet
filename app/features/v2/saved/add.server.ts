import invariant from "tiny-invariant";
import { z } from "zod";
import { db } from "~/db.server";
import { openlibrary } from "~/features/books/openLibrary";
import { getDirectors, movieDb } from "~/features/tvAndMovies";
import {
  formatBookToCreateMediaItem,
  formatMovieToCreateMediaItem,
  formatTvShowToCreateMediaItem,
} from "../list/add.server";

export const AddToSavedSchema = z.discriminatedUnion("mediaType", [
  z.object({ mediaType: z.literal("MOVIE"), id: z.string() }),
  z.object({
    mediaType: z.literal("BOOK"),
    id: z.string(),
    releaseYear: z.string().nullish().default(null),
  }),
  z.object({
    mediaType: z.literal("TV"),
    id: z.string(),
  }),
]);

export async function addSavedMovie({
  username,
  apiId,
}: {
  username: string;
  apiId: string;
}) {
  const movie = await movieDb.getMovie(apiId);
  const formattedMovie = formatMovieToCreateMediaItem(movie);
  let directors = movie.credits?.crew
    ? getDirectors(movie.credits?.crew)
    : [{ id: "unknown", name: "unknown" }];

  const savedItem = await db.mediaItemForLater.create({
    data: {
      user: {
        connect: {
          username,
        },
      },
      mediaItem: {
        connectOrCreate: {
          ...formattedMovie,
        },
      },
    },
  });

  return { title: movie.title, id: savedItem.id };
}

export async function addSavedBook({
  username,
  apiId,
  firstPublishedYear,
}: {
  username: string;
  apiId: string;
  firstPublishedYear: string | null;
}) {
  const book = await openlibrary.getBook(apiId);
  if (!book) throw new Error(`book id ${apiId} not found`);

  const formattedBook = formatBookToCreateMediaItem(book, firstPublishedYear);

  const savedItem = await db.mediaItemForLater.create({
    data: {
      user: {
        connect: {
          username,
        },
      },
      mediaItem: {
        connectOrCreate: {
          ...formattedBook,
        },
      },
    },
  });

  return { id: savedItem.id, title: book.title };
}

export async function addSavedShow({
  username,
  showId,
}: {
  username: string;
  showId: string;
}) {
  const show = await movieDb.getShow(showId);
  const season = show.seasons?.at(0);
  invariant(season, "No season found");

  const formattedShow = formatTvShowToCreateMediaItem(show, season);

  const savedItem = await db.mediaItemForLater.create({
    data: {
      user: {
        connect: {
          username,
        },
      },
      mediaItem: {
        connectOrCreate: { ...formattedShow },
      },
    },
  });

  return {
    id: savedItem.id,
    title: show.name,
  };
}
