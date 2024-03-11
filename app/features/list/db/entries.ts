import { db } from "~/db.server";
import { EntryType } from "./types";
import {
  getMovieReviewQuery,
  getBookReviewQuery,
  getTvReviewQuery,
} from "./queries";
import {
  normalizeBookEntry,
  normalizeMovieEntry,
  normalizeTvEntry,
} from "./normalizeEntries";

export async function getEntries({
  username,
  entryTypes = ["book", "movie", "tv"],
}: {
  username: string;
  entryTypes?: EntryType[];
}) {
  const data = await db.user.findFirst({
    where: { username },
    select: {
      id: true,
      MovieReviews: {
        ...getMovieReviewQuery(username),
        where: { user: { username } },
      },
      BookReviews: {
        ...getBookReviewQuery(username),
        where: { user: { username } },
      },
      TvReviews: {
        ...getTvReviewQuery(username),
        where: { user: { username } },
      },
    },
  });

  if (!data?.id) {
    return { userFound: false };
  }

  let { MovieReviews, BookReviews, TvReviews } = data;

  let entries = [
    ...(entryTypes.includes("movie")
      ? MovieReviews.map(normalizeMovieEntry)
      : []),

    ...(entryTypes.includes("book") ? BookReviews.map(normalizeBookEntry) : []),

    ...(entryTypes.includes("tv")
      ? TvReviews.map((t) => normalizeTvEntry(t))
      : []),
  ];

  return {
    userFound: true,
    entries: entries.sort(
      (a, b) =>
        b.createdAt!.getTime() - a.createdAt!.getTime() ||
        b.consumedDateTime.getTime() - a.consumedDateTime.getTime()
    ),
  };
}

export async function getEntryCounts({ username }: { username: string }) {
  const counts = await db.user.findFirst({
    where: { username },
    select: {
      id: true,
      _count: {
        select: {
          MovieReviews: true,
          TvReviews: true,
          BookReviews: true,
        },
      },
    },
  });

  if (!counts?.id) {
    throw new Error("User not found");
  }

  return {
    bookCount: counts._count.BookReviews,
    movieCount: counts._count.MovieReviews,
    tvCount: counts._count.TvReviews,
  };
}

export async function getEntriesAndCounts({
  username,
  entryTypes,
}: {
  username: string;
  entryTypes?: EntryType[];
}) {
  let _entryTypes: EntryType[] =
    !entryTypes || entryTypes?.length === 0
      ? ["book", "movie", "tv"]
      : entryTypes;

  const [entries, counts] = await Promise.all([
    getEntries({ username, entryTypes: _entryTypes }),
    getEntryCounts({ username }),
  ]);

  return { entries, counts };
}
