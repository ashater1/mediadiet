import { MediaType } from "@prisma/client";
import { json, LoaderFunctionArgs } from "@vercel/remix";
import { apStyleTitleCase } from "ap-style-title-case";
import { ComboboxOption } from "~/features/search/SearchCombobox";
import { getSearchTerm } from "~/features/search/utils";
import { movieDb } from "~/features/works/tvAndMovies/api";

export async function loader({ request }: LoaderFunctionArgs) {
  const searchTerm = getSearchTerm(request.url);
  const movies = await movieDb.searchMovies(searchTerm.trim());

  const data: ComboboxOption[] = movies.map((movie) => {
    return {
      id: String(movie.id),
      title: movie.title ? apStyleTitleCase(movie.title) ?? "" : "",
      releaseYear: movie.release_date?.slice(0, 4),
    };
  });

  return json({ data, mediaType: MediaType.MOVIE });
}
