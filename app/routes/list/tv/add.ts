import { ActionFunctionArgs, json } from "@vercel/remix";
import { addNewTvEntry } from "~/features/tvAndMovies/db";
import { NewTvSchema } from "~/features/add/types";
import { convertStringToBool, createSupabaseClient } from "~/utils/supabase";
import { redirect } from "remix-typedjson";
import { deleteSavedMovie, deleteSavedShow } from "~/routes/saved/delete";

export async function action({ request }: ActionFunctionArgs) {
  const response = new Response();
  const supabaseClient = createSupabaseClient({ request, response });
  const user = await supabaseClient.auth.getUser();
  if (!user?.data?.user?.id)
    throw redirect("/login", { headers: response.headers });

  const body = await request.formData();
  const newShow = Object.fromEntries(body);

  const favorited = newShow.favorited
    ? convertStringToBool(newShow.favorited)
    : false;

  const rating = Number(newShow.rating) || null;

  const result = NewTvSchema.parse({
    ...newShow,
    stars: rating,
    favorited,
  });

  await Promise.all([
    addNewTvEntry({
      consumedDate: result.consumedDate,
      favorited: result.favorited,
      stars: result.stars ?? null,
      review: result.review ?? "",
      seasonId: result.seasonId,
      showId: result.id,
      userId: user.data.user.id,
      request,
      response,
    }),
    await deleteSavedShow({
      showId: result.id,
      userId: user.data.user.id,
    }),
  ]);

  return json({ success: true as const });
}
