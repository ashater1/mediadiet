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

export async function getEntriesAndListOwner({
  username,
  entryTypes = ["book", "movie", "tv"],
}: {
  username: string;
  entryTypes?: EntryType[];
}) {
  const data = await db.user.findFirst({
    where: { username },
    include: {
      // id: true,
      MovieReviews: {
        ...getMovieReviewQuery(username),
        take: 1,
        where: { user: { username } },
      },
      BookReviews: {
        ...getBookReviewQuery(username),
        take: 1,
        where: { user: { username } },
      },
      TvReviews: {
        ...getTvReviewQuery(username),
        take: 1,
        where: { user: { username } },
      },
    },
  });

  if (!data?.id) {
    return { userFound: false };
  }

  let { MovieReviews, BookReviews, TvReviews, ...user } = data;
  let entries = [
    ...data.MovieReviews.map((m) => normalizeMovieEntry(m)),
    ...data.BookReviews.map((b) => normalizeBookEntry(b)),
    ...data.TvReviews.map((t) => normalizeTvEntry(t)),
  ];

  return {
    userFound: true,
    user,
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

export async function getEntriesOwnerAndCounts({
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

  const [entriesAndListUser, counts] = await Promise.all([
    getEntriesAndListOwner({ username, entryTypes: _entryTypes }),
    getEntryCounts({ username }),
  ]);

  return { entriesAndListUser, counts };
}
