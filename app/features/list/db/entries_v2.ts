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
    throw new Error("User not found");
  }

  let entries = [...data.MovieReviews, ...data.BookReviews, ...data.TvReviews];

  return entries.sort(
    (a, b) =>
      b.createdAt!.getTime() - a.createdAt!.getTime() ||
      b.consumedDate!.getTime() - a.consumedDate!.getTime()
  );
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
