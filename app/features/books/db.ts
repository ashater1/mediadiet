import { db } from "~/utils/db.server";
import { openlibrary } from "./openLibrary";
import { parse } from "date-fns";

type AddNewBookEntryArgs = {
  audiobook: boolean;
  bookId: string;
  consumedDate: string;
  favorited: boolean;
  stars: number | null;
  review: string;
  request: Request;
  response: Response;
  firstPublishedYear?: string;
  userId: string;
};

export async function addNewBookEntry({
  audiobook,
  firstPublishedYear,
  bookId,
  consumedDate,
  favorited,
  stars,
  review,
  userId,
  request,
  response,
}: AddNewBookEntryArgs) {
  const book = await openlibrary.getBook(bookId);

  const publishedDate =
    firstPublishedYear &&
    parse(firstPublishedYear, "yyyy", new Date()).toISOString();

  if (!book) throw new Error(`book id ${bookId} not found`);

  const authors = book.authors?.length
    ? book.authors.map(({ key, name }) => ({ key, name }))
    : [{ key: "unknown", name: "unknown" }];

  const newReview = db.bookReview.create({
    data: {
      audiobook,
      consumedDate,
      stars,
      favorited,
      review,
      user: {
        connect: {
          id: userId,
        },
      },
      book: {
        connectOrCreate: {
          where: { id: bookId },
          create: {
            id: book.id,
            title: book.title ?? "",
            publishedDate,
            coverId: book.covers,
            authors: {
              connectOrCreate: [
                ...authors.map((author) => ({
                  create: {
                    name: author.name ?? "",
                    id: author.key,
                  },
                  where: { id: author.key },
                })),
              ],
            },
          },
        },
      },
    },
  });

  return newReview;
}
