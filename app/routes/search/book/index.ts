import { LoaderFunctionArgs, SerializeFrom, json } from "@vercel/remix";
import { ComboboxOption, getSearchTerm } from "~/features/search";
import { googleBooks } from "~/features/books";
import { format } from "date-fns";
import { listToString, safeFilter } from "~/utils/funcs";
import { openlibrary } from "~/features/books/openLibrary";

export type BookSearchResults = (ComboboxOption & {
  imgSrc: string | null;
  medianPages: number | null;
})[];

export async function loader({ request }: LoaderFunctionArgs) {
  const searchTerm = getSearchTerm(request.url);

  const { docs: books } = await openlibrary.search({
    queryType: "title",
    searchTerm,
  });

  const data: BookSearchResults = books.map((book) => {
    const coverTypeAndId = book.cover_i
      ? `id/${book.cover_i}`
      : book.cover_edition_key
      ? `olid/${book.cover_edition_key}`
      : null;

    const imgSrc = coverTypeAndId
      ? `https://covers.openlibrary.org/b/${coverTypeAndId}-L.jpg`
      : null;

    const authors = book.author_name
      ? listToString(safeFilter(book.author_name), 1)
      : undefined;

    const year = book.first_publish_year
      ? String(book.first_publish_year)
      : null;

    const medianPages = book.number_of_pages_median ?? null;

    return {
      creators: authors,
      id: book.key,
      imgSrc,
      releaseYear: year,
      title: book.title ?? "",
      medianPages,
    };
  });

  return json({ data, mediaType: "book" as const });
}
