import { ActionFunctionArgs, json, redirect } from "@vercel/remix";
import { NewMovieSchema } from "~/features/add/types";
import { addNewMovieEntry } from "~/features/tvAndMovies/db";
import { deleteSavedMovie } from "~/features/saved/delete";
import { convertStringToBool, createSupabaseClient } from "~/utils/supabase";
import { setToast } from "~/features/toasts/toast.server";

export async function action({ request }: ActionFunctionArgs) {
  const response = new Response();
  const supabaseClient = createSupabaseClient({ request, response });

  const user = await supabaseClient.auth.getUser();

  if (!user?.data?.user?.id)
    throw redirect("/login", { headers: response.headers });

  const body = await request.formData();
  const newMovie = Object.fromEntries(body);

  const favorited = newMovie.favorited
    ? convertStringToBool(newMovie.favorited)
    : false;

  const rating = Number(newMovie.rating) || null;

  const result = NewMovieSchema.parse({
    ...newMovie,
    stars: rating,
    favorited,
  });

  let [{ movie }] = await Promise.all([
    addNewMovieEntry({
      onPlane: result.onPlane,
      inTheater: result.inTheater,
      favorited: result.favorited,
      consumedDate: result.consumedDate,
      stars: result.stars ?? null,
      review: result.review,
      movieId: result.id,
      userId: user.data.user.id,
      request,
      response,
    }),
    deleteSavedMovie({
      movieId: result.id,
      userId: user.data.user.id,
    }),
  ]);

  await setToast({
    request,
    response,
    toast: {
      type: "success",
      title: "Nice!",
      description: `You've added ${movie.title ?? ""} to your list!`,
    },
  });

  return json({ success: true }, { headers: response.headers });
}
