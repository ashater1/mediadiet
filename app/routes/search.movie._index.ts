import { json, LoaderFunctionArgs, SerializeFrom } from "@vercel/remix";
import { ComboboxOption, getSearchTerm } from "~/features/search";
import { movieDb } from "~/features/tvAndMovies";

export async function loader({ request }: LoaderFunctionArgs) {
  const searchTerm = getSearchTerm(request.url);
  const movies = await movieDb.searchMovies(searchTerm.trim());

  const data: ComboboxOption[] = movies.map((movie) => {
    return {
      id: String(movie.id),
      title: movie.title ?? "",
      releaseYear: movie.release_date?.slice(0, 4),
    };
  });

  return json({ data, mediaType: "movie" as const });
}
