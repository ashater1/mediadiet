import { db } from "~/db.server";
import { EntryType } from "./types";
import {
  getMovieReviewQuery,
  getBookReviewQuery,
  getTvReviewQuery,
} from "./queries";

export async function getEntries({
  username,
  entryTypes = ["book", "movie", "tv"],
}: {
  username: string;
  entryTypes?: EntryType[];
}) {
  const entries = await db.user.findFirst({
    where: { username },
    select: {
      id: true,
      MovieReviews: {
        ...getMovieReviewQuery(username),
        where: { user: { username } },
      },
      BookReviews: {
        ...getBookReviewQuery,
        where: { user: { username } },
      },
      TvReviews: {
        ...getTvReviewQuery,
        where: { user: { username } },
      },
    },
  });

  if (!entries?.id) {
    throw new Error("User not found");
  }

  return entries;
}

export async function getEntryCounts({ username }: { username: string }) {
  const counts = await db.user.findFirst({
    where: { username: username },
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
  entryTypes: EntryType[];
}) {
  const [entries, counts] = await Promise.all([
    getEntries({ username: "test", entryTypes: ["movie", "book", "tv"] }),
    getEntryCounts({ username: "test" }),
  ]);
}
