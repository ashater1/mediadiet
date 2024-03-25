import { MediaType } from "@prisma/client";
import { json, LoaderFunctionArgs } from "@vercel/remix";
import { ComboboxOption } from "~/features/v2/search/SearchCombobox";
import { getSearchTerm } from "~/features/v2/search/utils";

import { movieDb } from "~/features/tvAndMovies";
import { titleize } from "~/utils/capitalize";

export async function loader({ request }: LoaderFunctionArgs) {
  const searchTerm = getSearchTerm(request.url);
  const movies = await movieDb.searchMovies(searchTerm.trim());

  const data: ComboboxOption[] = movies.map((movie) => {
    return {
      id: String(movie.id),
      title: movie.title ? titleize(movie.title) ?? "" : "",
      releaseYear: movie.release_date?.slice(0, 4),
    };
  });

  return json({ data, mediaType: MediaType.MOVIE });
}
