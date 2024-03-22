import { MediaType } from "@prisma/client";
import { format, formatInTimeZone } from "date-fns-tz";
import { db } from "~/db.server";
import { listToString } from "~/utils/funcs";

export type Review = Awaited<ReturnType<typeof getEntries>>[number];
export type FormattedReview = ReturnType<typeof formatEntries>;

type GetEntriesProps = {
  username: string;
  orderBy?: "desc" | "asc";
  skip?: number;
  take?: number;
  mediaTypes: MediaType[];
};

export function formatEntries(review: Review) {
  let { creator, releaseDate, ...mediaItem } = review.mediaItem;
  let { review: textReview, consumedDate, createdAt, ..._review } = review;

  let _consumedDate = formatInTimeZone(review.consumedDate, "utc", "M/d");

  let _createdAt =
    review.createdAt && formatInTimeZone(review.createdAt, "utc", "M/d");

  let releaseYear = releaseDate && formatInTimeZone(releaseDate, "utc", "yyyy");

  let _creator = listToString(review.mediaItem.creator.map((c) => c.name));
  let hasReview = !!textReview;

  let title = mediaItem.TvSeries
    ? `${mediaItem.TvSeries.title} - ${mediaItem.title}`
    : mediaItem.title;

  return {
    hasReview,
    consumedDate: _consumedDate,
    createdAt: _createdAt,
    ..._review,
    MediaItem: { ...mediaItem, title, releaseYear, creator: _creator },
  };
}

export async function getEntries({
  username,
  orderBy = "desc",
  skip = 0,
  take = 30,
  mediaTypes = [MediaType.MOVIE, MediaType.BOOK, MediaType.TV],
}: GetEntriesProps) {
  const entries = await db.user.findFirstOrThrow({
    where: {
      username,
    },
    select: {
      Review: {
        where: {
          mediaItem: {
            mediaType: {
              in: [...mediaTypes],
            },
          },
        },
        include: {
          mediaItem: {
            include: {
              TvSeries: true,
              creator: true,
            },
          },
        },
        skip,
        take,
        orderBy: [
          {
            consumedDate: orderBy,
          },
          { createdAt: orderBy },
        ],
      },
    },
  });

  return entries.Review;
}

export async function getEntry({ id }: { id: string }) {
  const entry = await db.review.findFirst({
    where: {
      id,
    },
    include: {
      mediaItem: {
        include: {
          TvSeries: true,
          creator: true,
        },
      },
    },
  });

  if (!entry) return null;
  const { mediaItem, ..._entry } = entry;
  const formattedConsumedDate = formatInTimeZone(
    entry.consumedDate,
    "utc",
    "MMM d, yyyy"
  );
  const coverArt =
    mediaItem.mediaType === "BOOK"
      ? `https://covers.openlibrary.org/b/id/${mediaItem.coverArt}-L.jpg`
      : `https://image.tmdb.org/t/p/w342${mediaItem.coverArt}`;

  const creator = listToString(entry?.mediaItem?.creator.map((c) => c.name));

  const releaseYear = mediaItem.releaseDate?.getFullYear();

  return {
    ...entry,
    formattedConsumedDate,
    mediaItem: { ...mediaItem, releaseYear, coverArt, creator },
  };
}
