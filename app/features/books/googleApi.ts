import _ from "lodash";
import invariant from "tiny-invariant";
import { z } from "zod";
import { listToString, safeFilter } from "~/utils/funcs";

const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
const apiUrl = "https://www.googleapis.com/books/v1";

const dateRegex =
  /^(?<year>\d{4})(?:-(?<month>\d{1,2})(?:-(?<day>\d{1,2}))?)?$/;

const DateSchema = z
  .string()
  .regex(dateRegex, { message: "Invalid date provided" })
  .transform((val) => {
    if (!val) return null;
    const [year, month, day] = val.split("-").map((v) => parseInt(v));
    return new Date(year, month ?? 1, day ?? 1);
  })
  .nullish();

const IsbnSchema = z.object({
  type: z.union([z.literal("ISBN_10"), z.literal("ISBN_13")]).nullish(),
  identifier: z.string().nullish(),
});

const VolumeInfoSchema = z.object({
  title: z.string().nullish(),
  subtitle: z.string().nullish(),
  authors: z.array(z.string()).nullish(),
  publishedDate: DateSchema,
});

const SearchSchema = z.object({
  items: z
    .array(z.object({ id: z.string(), volumeInfo: VolumeInfoSchema.nullish() }))
    .default([]),
});

const GetBookSchema = z.object({
  id: z.string(),
  volumeInfo: VolumeInfoSchema.and(
    z.object({ pageCount: z.number().nullish() }).nullish()
  ),
});

export type GetBookType = z.infer<typeof GetBookSchema>;
export type VolumeInfoType = z.infer<typeof VolumeInfoSchema>;

class GoogleBooks {
  constructor() {}

  getBookImageUrl = (bookId: string) => {
    let url = `https://books.google.com/books/content?id=${bookId}&printsec=frontcover&img=1&zoom=8&source=gbs_api`;
    return url;
  };

  async search({
    searchTerm,
    filterBlankTitles = true,
  }: {
    searchTerm: string;
    filterBlankTitles?: boolean;
  }) {
    invariant(searchTerm.trim(), "A blank or empty string was provided");
    const url = `${apiUrl}/volumes?q=${searchTerm}`;
    const response = await fetch(url);
    const body = await response.json();
    let { items } = SearchSchema.parse(body);

    if (!items.length) return items;
    const reducedBooks = safeFilter(
      _(items)
        .groupBy(
          (item) =>
            `${listToString(item.volumeInfo?.authors)}-${
              item.volumeInfo?.title ?? ""
            }`
        )
        .map((bookGroup) =>
          _.minBy(bookGroup, (book) => book.volumeInfo?.publishedDate)
        )
        .value()
    );

    if (filterBlankTitles) {
      return reducedBooks.filter(
        (book) => book.volumeInfo && book.volumeInfo?.title
      );
    }

    return reducedBooks;
  }

  async getBook(id: string) {
    let url = `${apiUrl}/volumes/${id}`;
    let response = await fetch(url);
    let body = await response.json();
    let result = GetBookSchema.parse(body);

    return { ...result };
  }
}

export const googleBooks = new GoogleBooks();
