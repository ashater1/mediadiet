import { listToString, safeFilter } from "~/utils/funcs";
import { MovieDbImageSizes } from "./types";
import { formatInTimeZone } from "date-fns-tz";
import { format } from "date-fns";
import { BookEntry, MovieEntry, TvEntry } from "./queries";

const formatDate = (date: Date, format: string) => {
  return formatInTimeZone(date, "utc", format);
};

export function normalizeMovieEntry(
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
    createdAt: item.createdAt,
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

export function normalizeTvEntry(
  item: TvEntry,
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
    createdAt: item.createdAt,
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

export function normalizeBookEntry(item: BookEntry) {
  return {
    id: item.id,
    consumedDateTime: item.consumedDate,
    consumedDate: formatDate(item.consumedDate, "M/d"),
    creators: listToString(safeFilter(item.book.authors.map((a) => a.name))),
    createdAt: item.createdAt,
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
