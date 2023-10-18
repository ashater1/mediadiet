import { movieDb } from "./api";
import { getDirectors } from "./utils";
import { db } from "~/utils/db.server";

type AddNewMovieEntryArgs = {
  onPlane: boolean;
  inTheater: boolean;
  movieId: string;
  consumedDate: Date;
  favorited: boolean;
  review: string;
  request: Request;
  response: Response;
  userId: string;
  stars: number | null;
};

type AddNewShowEntryArgs = {
  showId: string;
  seasonId: string;
  consumedDate: Date;
  favorited: boolean;
  review: string;
  request: Request;
  response: Response;
  userId: string;
  stars: number | null;
};

export async function addNewMovieEntry({
  onPlane,
  inTheater,
  movieId,
  consumedDate,
  favorited,
  review,
  userId,
  stars,
}: AddNewMovieEntryArgs) {
  console.log({ stars });
  const movie = await movieDb.getMovie(movieId);

  let directors = movie.credits?.crew
    ? getDirectors(movie.credits?.crew)
    : [{ id: "unknown", name: "unknown" }];

  const newReview = db.movieReview.create({
    data: {
      onPlane,
      inTheater,
      consumedDate,
      stars,
      favorited,
      review,
      user: {
        connect: {
          id: userId,
        },
      },
      movie: {
        connectOrCreate: {
          where: { id: String(movieId) },
          create: {
            id: String(movie.id),
            posterPath: movie.poster_path,
            title: movie.title ?? "",
            releasedYear: movie.release_date
              ? parseInt(movie.release_date.slice(0, 4))
              : undefined,
            directors: {
              connectOrCreate: [
                ...directors.map((director) => ({
                  create: {
                    id: String(director.id),
                    name: director.name,
                  },
                  where: { id: String(director.id) },
                })),
              ],
            },
          },
        },
      },
    },
  });

  return newReview;
}

export async function addNewTvEntry({
  showId,
  seasonId,
  consumedDate,
  favorited,
  stars,
  review,
  userId,
}: AddNewShowEntryArgs) {
  const show = await movieDb.getShow(showId);
  const season = show.seasons.find((season) => season?.id === seasonId);
  const networks = show.networks.map((network) => {
    if (network && network.id && network.name) return { ...network };
  }) as { id: number; name: string; logo_path?: string }[];

  if (!season)
    throw new Error(`Season id ${seasonId} not found in show ${showId}`);

  const newReview = db.tvReview.create({
    data: {
      consumedDate,
      favorited,
      stars,
      review,
      user: { connect: { id: userId } },
      tvSeason: {
        connectOrCreate: {
          where: { id: String(season.id) },
          create: {
            id: String(season.id),
            posterPath: season.poster_path ?? undefined,
            title: season.name ?? "",
            airDate: season.air_date,
            seasonNumber: season.season_number,
            tvShow: {
              connectOrCreate: {
                where: { id: String(show.id) },
                create: {
                  id: String(show.id),
                  title: show.name ?? "",
                  studio: {
                    connectOrCreate: [
                      ...networks.map((network) => ({
                        where: {
                          id: String(network.id),
                        },
                        create: {
                          id: String(network.id),
                          name: network.name,
                        },
                      })),
                    ],
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  return newReview;
}
