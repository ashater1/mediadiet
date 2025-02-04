import { LoaderFunctionArgs, json } from "@vercel/remix";
import { openlibrary } from "~/features/works/books/openLibrary";
import { listToString, safeFilter } from "~/utils/funcs";
import { MediaType } from "@prisma/client";
import { ComboboxOption } from "~/features/search/SearchCombobox";
import { getSearchTerm } from "~/features/search/utils";
import { apStyleTitleCase } from "ap-style-title-case";

export type BookSearchResults = (ComboboxOption & {
  imgSrc: string | null;
  medianPages: number | null;
})[];

export async function loader({ request }: LoaderFunctionArgs) {
  const searchTerm = getSearchTerm(request.url);

  const books = await openlibrary.search({
    queryType: "q",
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
      title: book.title ? apStyleTitleCase(book.title) ?? "" : "",
      medianPages,
    };
  });

  return json({ data, mediaType: MediaType.BOOK });
}
