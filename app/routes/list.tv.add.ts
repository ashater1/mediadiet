import { ActionFunctionArgs, json, redirect } from "@vercel/remix";
import { NewTvSchema } from "~/features/add/types";
import { addNewTvEntry } from "~/features/tvAndMovies/db";
import { convertStringToBool, createSupabaseClient } from "~/utils/supabase";
import { deleteSavedShow } from "~/features/saved/delete";
import { setToast } from "~/features/toasts/toast.server";

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

  let [{ show, season }] = await Promise.all([
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
    deleteSavedShow({
      showId: result.id,
      userId: user.data.user.id,
    }),
  ]);

  await setToast({
    request,
    response,
    toast: {
      type: "success",
      title: "Nice!",
      description: `You've added ${show.original_name ?? ""} ${
        season.name && " - "
      } ${season.name ?? ""} to your list!`,
    },
  });

  return json({ success: true }, { headers: response.headers });
}
