import { db } from "~/utils/db.server";
import { format, formatInTimeZone } from "date-fns-tz";
import { listToString, safeFilter } from "~/utils/funcs";
import { orderBy } from "lodash";

export type MovieDbImageSizes =
  | 92
  | 154
  | 185
  | 342
  | 500
  | 780
  | "sm"
  | "md"
  | "lg";

type GetListArgs = { userId: string; withReview?: boolean };

const formatDate = (date: Date, format: string) => {
  return formatInTimeZone(date, "utc", format);
};

export async function getMoviesList({ userId }: GetListArgs) {
  const movieItems = await db.movieReview.findMany({
    where: {
      userId,
    },
    include: {
      movie: {
        include: {
          directors: true,
        },
      },
    },
  });

  return movieItems;
}

export function normalizeMovieEntry(
  item: GetMovieListItem,
  imgSize: "sm" | "md" | "lg" | number = "sm"
) {
  const _imgSize =
    imgSize === "sm"
      ? "92"
      : imgSize === "md"
      ? "342"
      : imgSize === "lg"
      ? "500"
      : imgSize;

  return {
    id: item.id,
    consumedDateTime: item.consumedDate,
    consumedDate: formatDate(item.consumedDate, "M/d"),
    creators: listToString(safeFilter(item.movie.directors.map((d) => d.name))),
    favorited: item.favorited ?? undefined,
    hasReview: !!item.review,
    img: item.movie.posterPath
      ? `https://image.tmdb.org/t/p/w${_imgSize}${item.movie.posterPath}`
      : null,
    mediaType: "movie" as const,
    review: item.review,
    releaseYear: String(item.movie.releasedYear),
    title: item.movie.title,
    onPlane: item.onPlane,
    inTheater: item.inTheater,
    stars: item.stars,
  };
}

export async function getTvList({ userId }: GetListArgs) {
  const tvItems = await db.tvReview.findMany({
    where: {
      userId,
    },
    include: {
      tvSeason: {
        include: {
          tvShow: {
            include: { studio: true },
          },
        },
      },
    },
  });

  return tvItems;
}

export function normalizeTvEntry(
  item: GetTvListItem,
  imgSize: MovieDbImageSizes = "sm"
) {
  const _imgSize =
    imgSize === "sm"
      ? "92"
      : imgSize === "md"
      ? "342"
      : imgSize === "lg"
      ? "500"
      : imgSize;

  return {
    id: item.id,
    consumedDateTime: item.consumedDate,
    consumedDate: formatDate(item.consumedDate, "M/d"),
    creators: listToString(
      safeFilter(item.tvSeason.tvShow.studio.map((s) => s.name))
    ),
    favorited: item.favorited ?? undefined,
    hasReview: !!item.review,
    img: item.tvSeason.posterPath
      ? `https://image.tmdb.org/t/p/w${_imgSize}${item.tvSeason.posterPath}`
      : null,
    mediaType: "tv" as const,
    releaseYear: item.tvSeason.airDate && format(item.tvSeason.airDate, "yyyy"),
    review: item.review,
    stars: item.stars,
    title: `${item.tvSeason.tvShow.title} - ${
      item.tvSeason.title
        ? item.tvSeason.title
        : `Season ${item.tvSeason.seasonNumber}`
    }`,
  };
}

export async function getBooksList({ userId }: GetListArgs) {
  const bookItems = await db.bookReview.findMany({
    where: {
      userId,
    },
    include: {
      book: {
        include: {
          authors: true,
        },
      },
    },
  });

  return bookItems;
}

export function normalizeBookEntry(item: GetBooksListItem) {
  return {
    id: item.id,
    consumedDateTime: item.consumedDate,
    consumedDate: formatDate(item.consumedDate, "M/d"),
    creators: listToString(safeFilter(item.book.authors.map((a) => a.name))),
    favorited: item.favorited ?? undefined,
    hasReview: !!item.review,
    img:
      item.book.coverId &&
      `https://covers.openlibrary.org/b/id/${item.book.coverId}-L.jpg`,
    mediaType: "book" as const,
    releaseYear: item.book.publishedDate?.toISOString().slice(0, 4),
    review: item.review,
    title: item.book.title,
    audiobook: item.audiobook,
    stars: item.stars,
  };
}

export async function getEntriesList({
  userId,
  imgSize,
}: {
  userId: string;
  imgSize?: number;
}) {
  const [booksList, moviesList, tvList] = await Promise.all([
    getBooksList({ userId }),
    getMoviesList({ userId }),
    getTvList({ userId }),
  ]);

  const normalizedBookEntries = booksList.map((e) => normalizeBookEntry(e));
  const normalizedMovieEntries = moviesList.map((e) => normalizeMovieEntry(e));
  const normalizedTvEntries = tvList.map((e) => normalizeTvEntry(e));

  const counts = {
    books: booksList.length,
    movies: moviesList.length,
    tv: tvList.length,
  };

  const combinedItems = [
    ...normalizedBookEntries,
    ...normalizedMovieEntries,
    ...normalizedTvEntries,
  ];

  const orderedItems = orderBy(
    combinedItems,
    ["consumedDateTime", "createdAt"],
    ["desc", "desc"]
  );

  return { counts, orderedItems };
}

export type Counts = Awaited<ReturnType<typeof getEntriesList>>["counts"];

export type GetMovieListItem = Awaited<
  ReturnType<typeof getMoviesList>
>[number];

export type GetTvListItem = Awaited<ReturnType<typeof getTvList>>[number];

export type GetBooksListItem = Awaited<ReturnType<typeof getBooksList>>[number];
