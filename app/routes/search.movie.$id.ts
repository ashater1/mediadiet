import { LoaderFunctionArgs } from "@vercel/remix";
import { listToString, safeFilter } from "~/utils/funcs";
import invariant from "tiny-invariant";
import { MediaType } from "@prisma/client";
import { movieDb } from "~/features/v2/tvAndMovies/api";

export async function loader({ params }: LoaderFunctionArgs) {
  const movieId = params.id;
  invariant(movieId, "movieId was not provided");

  const movie = await movieDb.getMovie(movieId);
  const directorNames = listToString(
    safeFilter(movie.directors.map((d) => d.name))
  );

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
