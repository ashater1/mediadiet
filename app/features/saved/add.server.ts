import invariant from "tiny-invariant";
import { z } from "zod";
import { db } from "~/db.server";
import { openlibrary } from "~/features/works/books/openLibrary";
import {
  formatBookToCreateMediaItem,
  formatMovieToCreateMediaItem,
  formatTvShowToCreateMediaItem,
} from "../list/add.server";
import { movieDb } from "~/features/works/tvAndMovies/api";

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

  const isSaved = await db.mediaItemForLater.findFirst({
    where: {
      user: {
        username,
      },
      mediaItem: {
        mediaType: "MOVIE",
        apiId,
      },
    },
  });

  if (isSaved) {
    await db.mediaItemForLater.update({
      where: {
        mediaItemId_userId: {
          mediaItemId: isSaved.mediaItemId,
          userId: isSaved.userId,
        },
      },
      data: {
        createdAt: new Date(),
      },
    });

    return { title: movie.title, id: isSaved.id };
  } else {
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

  const isSaved = await db.mediaItemForLater.findFirst({
    where: {
      user: {
        username,
      },
      mediaItem: {
        mediaType: "BOOK",
        apiId,
      },
    },
  });

  if (isSaved) {
    await db.mediaItemForLater.update({
      where: {
        mediaItemId_userId: {
          mediaItemId: isSaved.mediaItemId,
          userId: isSaved.userId,
        },
      },
      data: {
        createdAt: new Date(),
      },
    });

    return { title: book.title, id: isSaved.id };
  } else {
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
