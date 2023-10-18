import { googleBooks } from "~/features/books";
import { listToString } from "~/utils/funcs";
import { LoaderFunctionArgs } from "@vercel/remix";
import { safeFilter } from "~/utils/funcs";
import { z } from "zod";
import { format } from "date-fns";
import { openlibrary } from "~/features/books/openLibrary";

export async function loader({ params }: LoaderFunctionArgs) {
  const _bookId = params.id;
  const bookId = z.string().parse(_bookId);

  const book = await openlibrary.getBook(bookId);

  const authors = listToString(
    safeFilter(book.authors.map((author) => author.name)),
    2
  );

  const data = {
    title: book.title,
    creators: authors,
  };

  return {
    ...data,
    mediaType: "book" as const,
  };
}
