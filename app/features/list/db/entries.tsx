import { Prisma } from "@prisma/client";
import { format } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import _ from "lodash";
import { db } from "~/db.server";
import { listToString, safeFilter } from "~/utils/funcs";

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

const formatDate = (date: Date, format: string) => {
  return formatInTimeZone(date, "utc", format);
};

export const bookReviewInclude = {
  book: {
    include: {
      authors: true,
    },
  },
};

export const movieReviewInclude = {
  movie: { include: { directors: true } },
};

export const tvReviewInclude = {
  tvSeason: { include: { tvShow: { include: { studio: true } } } },
};

type BookEntry = Prisma.BookReviewGetPayload<{
  include: typeof bookReviewInclude;
}>;

type MovieEntry = Prisma.MovieReviewGetPayload<{
  include: typeof movieReviewInclude;
}>;

type TvEntry = Prisma.TvReviewGetPayload<{
  include: typeof tvReviewInclude;
}>;

function normalizeMovieEntry(
  item: MovieEntry,
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
    stars: item.stars,
    review: item.review,
    releaseYear: String(item.movie.releasedYear),
    title: item.movie.title,
    onPlane: item.onPlane,
    inTheater: item.inTheater,
  };
}

function normalizeTvEntry(item: TvEntry, imgSize: MovieDbImageSizes = "sm") {
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
    stars: item.stars,
    releaseYear: item.tvSeason.airDate && format(item.tvSeason.airDate, "yyyy"),
    review: item.review,
    title: `${item.tvSeason.tvShow.title} - ${
      item.tvSeason.title
        ? item.tvSeason.title
        : `Season ${item.tvSeason.seasonNumber}`
    }`,
  };
}

function normalizeBookEntry(item: BookEntry) {
  return {
    id: item.id,
    consumedDateTime: item.consumedDate,
    consumedDate: formatDate(item.consumedDate, "M/d"),
    creators: listToString(safeFilter(item.book.authors.map((a) => a.name))),
    favorited: item.favorited ?? undefined,
    hasReview: !!item.review,
    img:
      item.book.olCoverId &&
      `https://covers.openlibrary.org/b/id/${item.book.olCoverId}-L.jpg`,
    mediaType: "book" as const,
    stars: item.stars,
    releaseYear: item.book.publishedDate?.toISOString().slice(0, 4),
    review: item.review,
    title: item.book.title,
    audiobook: item.audiobook,
  };
}

export async function getUserEntriesAndCounts({
  username,
}: {
  username: string;
}) {
  const entriesAndUser = await db.user.findFirst({
    where: { username },
    include: {
      BookReviews: { include: bookReviewInclude },
      MovieReviews: {
        include: movieReviewInclude,
      },
      TvReviews: { include: tvReviewInclude },
    },
  });

  if (!entriesAndUser?.id) {
    return {
      userFound: false as const,
    };
  }

  const bookEntries = entriesAndUser?.BookReviews.map((d) =>
    normalizeBookEntry(d)
  );

  const movieEntries =
    entriesAndUser?.MovieReviews.map((d) => normalizeMovieEntry(d)) ?? [];

  const tvEntries =
    entriesAndUser?.TvReviews.map((d) => normalizeTvEntry(d)) ?? [];

  const counts = {
    books: bookEntries.length,
    movies: movieEntries.length,
    tv: tvEntries.length,
  };

  const combinedEntries = [...bookEntries, ...movieEntries, ...tvEntries];

  const orderedEntries = _.orderBy(
    combinedEntries,
    ["consumedDateTime", "createdAt"],
    ["desc", "desc"]
  );

  const userInfo = {
    avatar: entriesAndUser.avatar,
    firstName: entriesAndUser.firstName,
    id: entriesAndUser.id,
    lastName: entriesAndUser.lastName,
    soderberghMode: entriesAndUser.soderberghMode,
    username: entriesAndUser.username,
  };

  return {
    counts,
    entries: orderedEntries,
    userFound: true as const,
    userInfo,
  };
}
