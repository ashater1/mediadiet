import { ActionFunctionArgs, json, redirect } from "@vercel/remix";
import { NewBookSchema } from "~/features/add/types";
import { getUser } from "~/features/auth/auth.server";
import { addNewBookEntry } from "~/features/books";
import { deleteSavedBook } from "~/routes/saved/delete";
import { convertStringToBool } from "~/utils/funcs";

export async function action({ request }: ActionFunctionArgs) {
  const response = new Response();
  const user = await getUser({ request, response });

  if (!user) {
    throw redirect("/login");
  }

  const body = await request.formData();
  const newBook = Object.fromEntries(body);

  const favorited = newBook.favorited
    ? convertStringToBool(newBook.favorited)
    : false;

  const rating = Number(newBook.rating) || null;

  const review = NewBookSchema.parse({
    ...newBook,
    stars: rating,
    favorited,
  });

  await Promise.all([
    addNewBookEntry({
      audiobook: review.audiobook,
      firstPublishedYear: review.firstPublishedYear ?? undefined,
      bookId: review.id,
      consumedDate: review.consumedDate.toISOString(),
      favorited: review.favorited,
      stars: review.stars ?? null,
      review: review.review,
      userId: user.id,
      request,
      response,
    }),
    await deleteSavedBook({
      bookId: review.id,
      userId: user.id,
    }),
  ]);

  return json({ success: true });
}
