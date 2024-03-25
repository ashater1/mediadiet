import { LoaderFunctionArgs } from "@vercel/remix";
import { listToString, safeFilter } from "~/utils/funcs";
import invariant from "tiny-invariant";
import { movieDb } from "~/features/v2/tvAndMovies/api";
import { MediaType } from "@prisma/client";

export async function loader({ params }: LoaderFunctionArgs) {
  const showId = params.id;
  invariant(showId, "showId is required");
  const show = await movieDb.getShow(showId);
  const seasons = safeFilter(show.seasons);

  const networkNames = safeFilter(
    show.networks.map((network) => network?.name)
  );
  let firstYear = show?.first_air_date?.slice(0, 4);
  let lastYear = show?.last_air_date?.slice(0, 4);
  let years =
    firstYear && lastYear && firstYear !== lastYear
      ? `${firstYear} - ${lastYear}`
      : firstYear ?? lastYear;

  return {
    posterPath: show.poster_path,
    title: show.name,
    creator: listToString(networkNames),
    releaseDate: years,
    mediaType: MediaType.TV,
    seasons,
  };
}
