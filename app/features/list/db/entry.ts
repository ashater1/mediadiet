import { db } from "~/db.server";
import {
  normalizeBookEntry,
  normalizeMovieEntry,
  normalizeTvEntry,
} from "../db";
import { format } from "date-fns";
import { MediaType } from "../types";
import { UpdateSchemaType } from "~/routes/$username.$reviewId.edit";

type WithReviewId<T> = T & { reviewId: string };

type UpdateBookEntryArgs = WithReviewId<
  Extract<UpdateSchemaType, { mediaType: "book" }>
>;
type UpdateMovieEntryArgs = WithReviewId<
  Extract<UpdateSchemaType, { mediaType: "movie" }>
>;
type UpdateTvEntryArgs = WithReviewId<
  Extract<UpdateSchemaType, { mediaType: "tv" }>
>;

export async function getBookEntry({ id }: { id: string }) {
  const bookReview = await db.bookReview.findUnique({
    where: {
      id,
    },
    include: {
      book: {
        include: {
          authors: true,
        },
      },
    },
  });

  if (!bookReview) return null;
  return normalizeBookEntry(bookReview);
}

export async function deleteBookEntry({ id }: { id: string }) {
  let book = await db.bookReview.delete({
    where: {
      id,
    },
    select: {
      book: {
        select: {
          title: true,
        },
      },
    },
  });

  return book;
}

export async function updateBookEntry({
  reviewId,
  mediaType,
  ...data
}: UpdateBookEntryArgs) {
  await db.bookReview.update({
    where: {
      id: reviewId,
    },
    data,
  });
}

export async function getMovieEntry({ id }: { id: string }) {
  const movieReview = await db.movieReview.findUnique({
    where: {
      id,
    },
    include: {
      movie: {
        include: {
          directors: true,
        },
      },
    },
  });

  if (!movieReview) return null;
  return normalizeMovieEntry(movieReview);
}

export async function deleteMovieEntry({ id }: { id: string }) {
  let movie = await db.movieReview.delete({
    where: {
      id,
    },
    select: {
      movie: {
        select: {
          title: true,
        },
      },
    },
  });

  return movie;
}

export async function updateMovieEntry({
  reviewId,
  mediaType,
  ...data
}: UpdateMovieEntryArgs) {
  await db.movieReview.update({
    where: {
      id: reviewId,
    },
    data,
  });
}

export async function getTvEntry({ id }: { id: string }) {
  const tvReview = await db.tvReview.findUnique({
    where: {
      id,
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

  if (!tvReview) return null;
  return normalizeTvEntry(tvReview);
}

export async function deleteTvEntry({ id }: { id: string }) {
  let show = await db.tvReview.delete({
    where: {
      id,
    },
    select: {
      tvSeason: {
        select: {
          title: true,
          tvShow: {
            select: {
              title: true,
            },
          },
        },
      },
    },
  });

  return {
    show: show.tvSeason.tvShow.title,
    season: show.tvSeason.title,
  };
}

export async function updateTvEntry({
  reviewId,
  mediaType,
  ...data
}: UpdateTvEntryArgs) {
  await db.tvReview.update({
    where: {
      id: reviewId,
    },
    data,
  });
}

export async function getEntry({ id }: { id: string }) {
  const reviews = await Promise.all([
    getBookEntry({ id }),
    getMovieEntry({ id }),
    getTvEntry({ id }),
  ]);

  const review = reviews.find((review) => review !== null);

  if (!review) throw new Error(`No review found with id ${id} found`);
  return {
    ...review,
    consumedDateTime: format(review.consumedDateTime, "yyyy-MM-dd"),
  };
}

export async function deleteEntry({
  id,
  mediaType,
}: {
  id: string;
  mediaType: MediaType;
}) {
  try {
    if (mediaType === "book") {
      let { book } = await deleteBookEntry({ id });
      return { success: true, title: book.title };
    }

    if (mediaType === "movie") {
      let { movie } = await deleteMovieEntry({ id });
      return { success: true, title: movie.title };
    }

    if (mediaType === "tv") {
      let { season, show } = await deleteTvEntry({ id });
      return { success: true, title: `${show}${season ? ` - ${season}` : ""}` };
    }
  } catch (e) {
    return { success: false, error: e };
  }
}

export async function updateEntry(data: UpdateSchemaType) {
  if (data.mediaType === "book") {
    await updateBookEntry(data);
    return { success: true };
  }

  if (data.mediaType === "movie") {
    await updateMovieEntry(data);
    return { success: true };
  }

  if (data.mediaType === "tv") {
    await updateTvEntry(data);
    return { success: true };
  }
}
