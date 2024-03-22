import invariant from "tiny-invariant";
import { z } from "zod";
import { safeFilter } from "~/utils/funcs";
import _ from "lodash";

type SearchDocumentType = z.infer<typeof searchDocumentSchema>;
export type Book = Awaited<ReturnType<OpenLibrary["getBook"]>>;

const searchDocumentSchema = z.object({
  title: z.string().nullish(),
  author_key: z.array(z.string().nullish()).nullish(),
  author_name: z.array(z.string().nullish()).nullish(),
  first_publish_year: z.number().nullish(),
  number_of_pages_median: z.number().nullish(),
  cover_edition_key: z.string().nullish(),
  cover_i: z.coerce.string().nullish(),
  key: z
    .string()
    .transform((val) =>
      val?.includes("works/") ? val?.split("works/")[1] : val
    ),
});

const searchResultSchema = z.object({
  docs: z.array(searchDocumentSchema),
});

const getBookSchema = z.object({
  key: z.string().transform((str) => str.replace(/^\/works\//, "")),
  isbn_10: z.string().nullish(),
  isbn_13: z.string().nullish(),
  authors: z
    .array(
      z.object({
        author: z.object({
          key: z.string().transform((str) => str.replace(/^\/authors\//, "")),
        }),
      })
    )
    .nullish()
    .default([]),
  title: z.string().nullish(),
  description: z.any(),
  first_publish_date: z.string().nullish(),
  covers: z
    .array(z.coerce.string())
    .nullish()
    .transform((val) => (val?.length ? val[0] : null)),
});

const getAuthorSchema = z.union([
  z.object({
    name: z.string().nullish(),
    key: z.string().transform((str) => str.replace(/^\/authors\//, "")),
  }),
  z.object({
    error: z.string(),
  }),
]);

export type GetAuthorSchema = z.infer<typeof getAuthorSchema>;

class OpenLibrary {
  static url = "https://openlibrary.org/";

  async search({
    queryType = "q",
    searchTerm,
    removeDuplicates = true,
  }: {
    queryType: string;
    searchTerm: string;
    removeDuplicates?: boolean;
  }) {
    invariant(searchTerm.trim(), "A blank or empty string was provided");

    const url = new URL("search.json", OpenLibrary.url);
    url.searchParams.append(queryType, searchTerm);
    url.searchParams.append("limit", "6");

    const response = await fetch(url);
    const body = await response.json();
    const result = searchResultSchema.parse(body);
    if (!removeDuplicates) return result.docs;
    else {
      const dupeCheck = (
        bookOne: SearchDocumentType,
        bookTwo: SearchDocumentType
      ) => {
        return (
          bookOne.title?.trim() === bookTwo.title?.trim() &&
          _.isEqual(bookOne.author_name, bookTwo.author_name)
        );
      };

      return _.uniqWith(result.docs, dupeCheck);
    }
  }

  async getBook(id: string) {
    invariant(id.trim(), "A blank or empty id was provided");
    const url = `https://openlibrary.org/books/${id}.json`;
    const response = await fetch(url);
    const body = await response.json();
    const result = getBookSchema.parse(body);

    const authorKeys = result.authors
      ? safeFilter(result.authors.map((author) => author.author.key ?? null))
      : [];

    const authors = authorKeys.length ? await this.getAuthors(authorKeys) : [];
    return { ...result, id: result.key, authors };
  }

  async getAuthor(id: string) {
    invariant(id.trim(), "A blank or empty id was provided");
    const url = `https://openlibrary.org/authors/${id}.json`;
    const response = await fetch(url);
    const body = await response.json();
    const result = getAuthorSchema.parse(body);
    if ("error" in result) return;
    return result;
  }

  async getAuthors(ids: string[]) {
    const authors = await Promise.all(ids.map((id) => this.getAuthor(id)));
    return safeFilter(authors);
  }
}

export const openlibrary = new OpenLibrary();
