import { ActionFunctionArgs, json } from "@vercel/remix";
import { redirect } from "remix-typedjson";
import { NewMovieSchema } from "~/features/add/types";
import { addNewMovieEntry } from "~/features/tvAndMovies/db";
import { deleteSavedMovie } from "~/routes/saved/delete";
import { convertStringToBool, createSupabaseClient } from "~/utils/supabase";

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

  await Promise.all([
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
    ,
    deleteSavedMovie({
      movieId: result.id,
      userId: user.data.user.id,
    }),
  ]);

  return json({ success: true });
}
