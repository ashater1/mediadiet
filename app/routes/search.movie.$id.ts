import { LoaderFunctionArgs } from "@vercel/remix";
import { getDirectors, movieDb } from "~/features/tvAndMovies";

import { listToString, safeFilter } from "~/utils/funcs";
import invariant from "tiny-invariant";
import { MediaType } from "@prisma/client";

export async function loader({ params }: LoaderFunctionArgs) {
  const movieId = params.id;
  invariant(movieId, "movieId was not provided");
  const movie = await movieDb.getMovie(movieId);
  const directors = getDirectors(movie.credits?.crew);
  const directorNames = listToString(safeFilter(directors.map((d) => d.name)));

  const data = {
    imgSrc:
      movie?.poster_path &&
      `https://image.tmdb.org/t/p/w500${movie?.poster_path}`,
    title: movie.title,
    creators: directorNames,
    releaseYear: movie.release_date?.slice(0, 4),
    length: movie.runtime ? `${movie.runtime} mins` : undefined,
  };

  return {
    ...data,
    mediaType: MediaType.MOVIE,
  };
}
