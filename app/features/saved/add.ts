import { db } from "~/db.server";
import { getDirectors, movieDb } from "../tvAndMovies";
import { openlibrary } from "../books/openLibrary";
import { parse } from "date-fns";

export async function addSavedMovie({
  movieId,
  userId,
}: {
  movieId: string;
  userId: string;
}) {
  const movie = await movieDb.getMovie(movieId);

  let directors = movie.credits?.crew
    ? getDirectors(movie.credits?.crew)
    : [{ id: "unknown", name: "unknown" }];

  const savedMovie = db.movieForLater.create({
    data: {
      user: {
        connect: {
          id: userId,
        },
      },
      movie: {
        connectOrCreate: {
          where: { id: String(movieId) },
          create: {
            id: String(movie.id),
            posterPath: movie.poster_path,
            title: movie.title ?? "",
            releasedYear: movie.release_date
              ? parseInt(movie.release_date.slice(0, 4))
              : undefined,
            directors: {
              connectOrCreate: [
                ...directors.map((director) => ({
                  create: {
                    id: String(director.id),
                    name: director.name,
                  },
                  where: { id: String(director.id) },
                })),
              ],
            },
          },
        },
      },
    },
  });

  return savedMovie;
}

export async function addSavedShow({
  showId,
  userId,
}: {
  showId: string;
  userId: string;
}) {
  const show = await movieDb.getShow(showId);

  const networks = show.networks.map((network) => {
    if (network && network.id && network.name) return { ...network };
  }) as { id: number; name: string; logo_path?: string }[];

  const savedShow = await db.showForLater.create({
    data: {
      user: {
        connect: {
          id: userId,
        },
      },
      tvShow: {
        connectOrCreate: {
          where: { id: String(show.id) },
          create: {
            id: String(show.id),
            title: show.name ?? "",
            studio: {
              connectOrCreate: [
                ...networks.map((network) => ({
                  where: {
                    id: String(network.id),
                  },
                  create: {
                    id: String(network.id),
                    name: network.name,
                  },
                })),
              ],
            },
          },
        },
      },
    },
  });

  return savedShow;
}

export async function addSavedBook({
  bookId,
  userId,
  firstPublishedYear,
}: {
  firstPublishedYear: string | null;
  bookId: string;
  userId: string;
}) {
  const book = await openlibrary.getBook(bookId);

  const publishedDate =
    firstPublishedYear &&
    parse(firstPublishedYear, "yyyy", new Date()).toISOString();

  if (!book) throw new Error(`book id ${bookId} not found`);

  const authors = book.authors?.length
    ? book.authors.map(({ key, name }) => ({ key, name }))
    : [{ key: "unknown", name: "unknown" }];

  const upsertedBook = await db.bookForLater.upsert({
    where: {
      bookId_userId: {
        bookId,
        userId,
      },
    },
    update: {
      addedAt: new Date(),
    },
    create: {
      user: {
        connect: {
          id: userId,
        },
      },
      book: {
        connectOrCreate: {
          where: { id: bookId },
          create: {
            id: book.id,
            title: book.title ?? "",
            publishedDate,
            olCoverId: book.covers,
            authors: {
              connectOrCreate: [
                ...authors.map((author) => ({
                  create: {
                    name: author.name ?? "",
                    id: author.key,
                  },
                  where: { id: author.key },
                })),
              ],
            },
          },
        },
      },
    },
  });

  return upsertedBook;
}

export async function getSavedMovies({ userId }: { userId: string }) {
  const savedMovies = await db.movieForLater.findMany({
    select: {
      movie: {
        select: {
          id: true,
        },
      },
    },
    where: {
      user: {
        id: userId,
      },
    },
  });

  return savedMovies.map((savedMovie) => savedMovie.movie.id);
}

export async function getSavedBooks({ userId }: { userId: string }) {
  const savedBooks = await db.bookForLater.findMany({
    select: {
      book: {
        select: {
          id: true,
        },
      },
    },
    where: {
      user: {
        id: userId,
      },
    },
  });

  return savedBooks.map((savedBook) => savedBook.book.id);
}

export async function getSavedShows({ userId }: { userId: string }) {
  const savedShows = await db.showForLater.findMany({
    select: {
      tvShow: {
        select: {
          id: true,
        },
      },
    },
    where: {
      user: {
        id: userId,
      },
    },
  });

  return savedShows.map((savedShow) => savedShow.tvShow.id);
}
