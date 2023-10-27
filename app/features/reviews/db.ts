import { db } from "~/db.server";
import { safeFilter } from "~/utils/funcs";
import {
  MovieDbImageSizes,
  normalizeBookEntry,
  normalizeMovieEntry,
  normalizeTvEntry,
} from "../list";
import { format } from "date-fns";

export async function getMovieReview({
  id,
  imgSize,
}: {
  id: string;
  imgSize?: MovieDbImageSizes;
}) {
  const review = await db.movieReview.findUnique({
    where: { id },
    include: {
      movie: {
        include: {
          directors: true,
        },
      },
    },
  });

  if (!review) return null;
  return normalizeMovieEntry(review, imgSize);
}

export async function getBookReview({ id }: { id: string }) {
  const review = await db.bookReview.findUnique({
    where: { id },
    include: {
      book: {
        include: {
          authors: true,
        },
      },
    },
  });

  if (!review) return null;
  return normalizeBookEntry(review);
}

export async function getTvReview({
  id,
  imgSize,
}: {
  id: string;
  imgSize?: MovieDbImageSizes;
}) {
  const review = await db.tvReview.findUnique({
    where: { id },
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

  if (!review) return null;
  return normalizeTvEntry(review, imgSize);
}

export async function getReview({
  id,
  imgSize,
}: {
  id: string;
  imgSize: MovieDbImageSizes;
}) {
  const [movieReview, bookReview, tvReview] = await Promise.all([
    getMovieReview({ id, imgSize }),
    getBookReview({ id }),
    getTvReview({ id, imgSize }),
  ]);

  const reviews = safeFilter([movieReview, bookReview, tvReview]);

  if (!reviews.length)
    return { success: false as const, error: "reveiewNotFound" as const };

  const review = reviews[0];

  return {
    success: true as const,
    ...review,
    formattedDate: format(review.consumedDateTime, "MMM d, yyyy"),
    utcDate: review.consumedDateTime.toISOString().slice(0, 10),
  };
}
