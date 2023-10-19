import { db } from "~/utils/db.server";

export async function deleteSavedMovie({
  movieId,
  userId,
}: {
  movieId: string;
  userId: string;
}) {
  const deletedSavedItem = await db.movieForLater.deleteMany({
    where: {
      movieId: {
        equals: movieId,
      },
      userId: {
        equals: userId,
      },
    },
  });

  return deletedSavedItem;
}

export async function deleteSavedShow({
  showId,
  userId,
}: {
  showId: string;
  userId: string;
}) {
  const deletedSavedItem = await db.showForLater.deleteMany({
    where: {
      tvShowId: {
        equals: showId,
      },
      userId: {
        equals: userId,
      },
    },
  });

  return deletedSavedItem;
}

export async function deleteSavedBook({
  bookId,
  userId,
}: {
  bookId: string;
  userId: string;
}) {
  const deletedSavedItem = await db.bookForLater.deleteMany({
    where: {
      bookId: {
        equals: bookId,
      },
      userId: {
        equals: userId,
      },
    },
  });

  return deletedSavedItem;
}

export async function deleteSavedShowItem({ itemId }: { itemId: string }) {
  const deletedSavedItem = await db.showForLater.delete({
    where: {
      id: itemId,
    },
  });

  return deletedSavedItem;
}

export async function deleteSavedMovieItem({ itemId }: { itemId: string }) {
  const deletedSavedItem = await db.movieForLater.delete({
    where: {
      id: itemId,
    },
  });

  return deletedSavedItem;
}

export async function deleteSavedBookItem({ itemId }: { itemId: string }) {
  const deletedSavedItem = await db.bookForLater.delete({
    where: {
      id: itemId,
    },
  });

  return deletedSavedItem;
}
