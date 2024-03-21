import { parse } from "date-fns";
import { db } from "~/db.server";
import { openlibrary } from "~/features/books/openLibrary";
import { getDirectors, movieDb } from "~/features/tvAndMovies";
import { safeFilter } from "~/utils/funcs";

// TODO - add savedTv functionality

export async function addSavedMovie({
  username,
  apiId,
}: {
  username: string;
  apiId: string;
}) {
  const movie = await movieDb.getMovie(apiId);

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
          where: {
            apiId_mediaType: {
              apiId,
              mediaType: "MOVIE",
            },
          },
          create: {
            apiId,
            mediaType: "MOVIE",
            title: movie.title ?? "",
            coverArt: movie.poster_path,
            releaseDate: movie.release_date
              ? parse(movie.release_date, "yyyy-MM-dd", new Date())
              : undefined,
            creator: {
              connectOrCreate: directors.map((d) => ({
                where: {
                  apiId_creatorType: {
                    apiId: String(d.id),
                    creatorType: "DIRECTOR" as const,
                  },
                },
                create: {
                  apiId: String(d.id),
                  creatorType: "DIRECTOR" as const,
                  name: d.name,
                },
              })),
            },
          },
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

  const releaseDate = firstPublishedYear
    ? parse(firstPublishedYear, "yyyy", new Date())
    : null;

  const authors = book.authors?.length
    ? book.authors.map(({ key, name }) => ({ key, name }))
    : [{ key: "unknown", name: "unknown" }];

  const savedItem = await db.mediaItemForLater.create({
    data: {
      user: {
        connect: {
          username,
        },
      },
      mediaItem: {
        connectOrCreate: {
          where: {
            apiId_mediaType: {
              apiId,
              mediaType: "BOOK",
            },
          },
          create: {
            apiId,
            mediaType: "BOOK",
            title: book.title ?? "",
            coverArt: book.covers,
            releaseDate,
            creator: {
              connectOrCreate: authors.map((author) => ({
                where: {
                  apiId_creatorType: {
                    apiId: String(author.key),
                    creatorType: "AUTHOR" as const,
                  },
                },
                create: {
                  apiId: String(author.key),
                  creatorType: "AUTHOR" as const,
                  name: author.name,
                },
              })),
            },
          },
        },
      },
    },
  });

  return { id: savedItem.id, title: book.title };
}
