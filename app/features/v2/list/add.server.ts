import { MediaType, Prisma } from "@prisma/client";
import { parse } from "date-fns";
import { z } from "zod";
import { db } from "~/db.server";
import { Book, openlibrary } from "~/features/books/openLibrary";
import { Movie, Season, Show, movieDb } from "~/features/tvAndMovies";

export type AddToListArgs = z.infer<typeof AddToListSchema> & {
  userId: string;
};

export const AddToListSchema = z.discriminatedUnion("mediaType", [
  z.object({
    mediaType: z.literal("MOVIE"),
    apiId: z.string(),
  }),
  z.object({
    mediaType: z.literal("BOOK"),
    apiId: z.string(),
    releaseYear: z.string().nullish().default(null),
  }),
  z.object({
    mediaType: z.literal("TV"),
    apiId: z.string(),
    seasonId: z.string(),
  }),
]);

// export type MediaItem = Prisma.MediaItemCreateInput;
export type MediaItem = Prisma.MediaItemCreateOrConnectWithoutReviewInput;

export function formatBookToCreateMediaItem(
  book: Book,
  firstPublishedYear: string | null
): MediaItem {
  const releaseDate = firstPublishedYear
    ? parse(firstPublishedYear, "yyyy", new Date())
    : null;

  return Prisma.validator<MediaItem>()({
    where: {
      apiId_mediaType: {
        apiId: book.id,
        mediaType: MediaType.BOOK,
      },
    },
    create: {
      apiId: book.id,
      mediaType: MediaType.BOOK,
      title: book.title ?? "",
      coverArt: book.covers,
      releaseDate,
      creator: {
        connectOrCreate: book.authors.map((author) => ({
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
  });
}

export function formatMovieToCreateMediaItem(movie: Movie): MediaItem {
  return Prisma.validator<MediaItem>()({
    where: {
      apiId_mediaType: {
        apiId: String(movie.id),
        mediaType: MediaType.BOOK,
      },
    },
    create: {
      apiId: String(movie.id),
      mediaType: MediaType.MOVIE,
      title: movie.title ?? "",
      coverArt: movie.poster_path,
      releaseDate: movie.release_date
        ? parse(movie.release_date, "yyyy-MM-dd", new Date())
        : undefined,
      creator: {
        connectOrCreate: movie.directors.map((d) => ({
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
  });
}

export function formatTvShowToCreateMediaItem(
  show: Show,
  season: Season
): MediaItem {
  return {
    where: {
      apiId_mediaType: {
        apiId: season.id,
        mediaType: "TV",
      },
    },
    create: {
      apiId: season.id,
      mediaType: "TV",
      title: season.name ?? "",
      releaseDate: season.air_date,
      coverArt: season.poster_path,
      length: season.episode_count,
      creator: {
        connectOrCreate: show.networks.map((studio) => ({
          where: {
            apiId_creatorType: {
              apiId: studio?.id ? String(studio.id) : "unknown",
              creatorType: "STUDIO" as const,
            },
          },
          create: {
            apiId: studio?.id ? String(studio.id) : "unknown",
            name: studio?.name ?? "unknown",
            creatorType: "STUDIO" as const,
          },
        })),
      },
      TvSeries: {
        connectOrCreate: {
          where: {
            apiId: String(show.id),
          },
          create: {
            apiId: String(show.id),
            title: show.name ?? "",
          },
        },
      },
    },
  };
}

export async function addNewEntry({ userId, apiId, ...args }: AddToListArgs) {
  if (args.mediaType === "BOOK") {
    const book = await openlibrary.getBook(apiId);
    const formattedBook = formatBookToCreateMediaItem(book, args.releaseYear);
    await db.review.create({
      data: {
        user: {
          connect: {
            id: userId,
          },
        },
        mediaItem: {
          connectOrCreate: {
            ...formattedBook,
          },
        },
      },
    });
  } else if (args.mediaType === "MOVIE") {
    const movie = await movieDb.getMovie(apiId);
    const formattedMovie = formatMovieToCreateMediaItem(movie);
    await db.review.create({
      data: {
        user: {
          connect: {
            id: userId,
          },
        },
        mediaItem: {
          connectOrCreate: {
            ...formattedMovie,
          },
        },
      },
    });
  } else if (args.mediaType === "TV") {
    const show = await movieDb.getShow(apiId);
    const season = show.seasons.find((s) => s?.id === args.seasonId);
    if (!season) throw new Error("Season not found");
    const formattedTvSeason = formatTvShowToCreateMediaItem(show, season);
    await db.review.create({
      data: {
        user: {
          connect: {
            id: userId,
          },
        },
        mediaItem: {
          connectOrCreate: {
            ...formattedTvSeason,
          },
        },
      },
    });
  }
}
