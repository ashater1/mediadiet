import { ClockIcon } from "@heroicons/react/20/solid";
import { Link, useFetcher, useLoaderData } from "@remix-run/react";
import { json, LoaderFunctionArgs } from "@vercel/remix";
import Spinner from "~/components/spinner";
import { db } from "~/db.server";
import { getUserDetails } from "~/features/auth/user.server";
import { FavoriteHeart, ReviewIcon } from "~/features/list/icons/icons";
import { getIsSavedItem } from "~/features/saved/get.server";
import { movieDb } from "~/features/tvAndMovies/api";
import { getFollowedThatHaveLogged } from "~/features/tvAndMovies/db";
import { listToString, safeFilter } from "~/utils/funcs";
import { getCoverArtUrl } from "~/utils/getCoverArtUrl";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const response = new Response();
  const user = await getUserDetails({ request, response });
  const movieId = params.id;

  const movie = await db.mediaItem.findFirst({
    where: {
      id: movieId,
      mediaType: "MOVIE",
    },
    select: {
      id: true,
      apiId: true,
    },
  });

  if (!movie) {
    throw new Response(null, {
      status: 404,
      statusText: "Movie not found",
    });
  }

  const [{ poster_path, ...movieDetails }, followers, isSavedItem] =
    await Promise.all([
      movieDb.getMovie(movie.apiId),
      user &&
        getFollowedThatHaveLogged({
          mediaItemId: movie.id,
          userId: user.id,
        }),
      user && getIsSavedItem({ mediaItemId: movie.id, userId: user.id }),
    ]);

  const posterPath = poster_path
    ? getCoverArtUrl({
        mediaType: "MOVIE",
        coverArtId: poster_path,
      })
    : null;

  return json(
    {
      mediaItemId: movie.id,
      ...movieDetails,
      posterPath,
      releaseYear: movieDetails.release_date?.slice(0, 4),
      followers,
      isSavedItem,
    },
    { headers: response.headers }
  );
}

export default function Movie() {
  const data = useLoaderData<typeof loader>();
  const fetcher = useFetcher();

  return (
    <div className="w-full">
      <div className="mt-4 flex gap-10">
        <div className="hidden w-80 rounded md:block">
          <img
            src={data.posterPath ?? ""}
            className="h-auto w-full rounded shadow-lg"
          />
        </div>

        <div className="flex w-full flex-col">
          <div className="flex">
            <div className="flex flex-col">
              <h2 className="min-w-0 font-semibold text-gray-900 line-clamp-2 md:text-2xl md:font-semibold">
                {data.title}
              </h2>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>
                  {listToString(safeFilter(data.directors.map((d) => d.name)))}
                </span>
                {data.directors.length && data.releaseYear && <span>•</span>}
                <span>{data.releaseYear}</span>
              </div>
              <div className="mb-4 mt-2 border-b border-gray-200" />
            </div>

            {data.isSavedItem && (
              <div className="w-28 ml-auto flex-col flex items-center group">
                <div className="cursor-pointer group h-10 w-10 relative">
                  <ClockIcon
                    onClick={() =>
                      fetcher.submit(
                        { mediaItemId: data.mediaItemId },
                        { method: "post", action: "/saved/delete" }
                      )
                    }
                    className="h-full w-full fill-primary-400"
                  />
                  {fetcher.formAction === "/saved/delete" && (
                    <div className="absolute top-1/2 -translate-y-1/2">
                      <Spinner className="p-2 h-full w-full stroke-slate-800" />
                    </div>
                  )}
                </div>
                <span className="group-hover:hidden inline-flexitems-center rounded-md bg-slate-50 px-2 py-1 text-xs font-medium text-slate-700 ring-1 ring-inset ring-pink-700/10">
                  Saved for later
                </span>
                <span className="group-hover:inline-flex hidden items-center rounded-md bg-pink-50 px-2 py-1 text-xs font-medium text-pink-700 ring-1 ring-inset ring-pink-700/10">
                  Remove
                </span>
              </div>
            )}
          </div>

          <div>
            <div className="flex gap-5">
              <div className="flex flex-col">
                {data.tagline && (
                  <span className="text-sm italic">{data.tagline}</span>
                )}
                <p className="mt-4 text-sm">{data.overview}</p>
              </div>
            </div>

            <h3 className="mt-12 text-sm font-bold">Your Friends</h3>
            <div className="mt-4 flex -space-x-6">
              {data.followers && data.followers.length ? (
                data.followers?.map((f) => (
                  <div className="transition-all duration-500 hover:pr-4 [&:not(:last-child)]:hover:mr-8 flex flex-col items-center group">
                    <div
                      className="rounded-full relative flex flex-col items-center"
                      key={f.id}
                    >
                      <Link to={`/${f.username}`}>
                        <img
                          className="ring-1 ring-primary-500 w-16 h-16 rounded-full overflow-hidden"
                          src={f.avatar ?? ""}
                          alt={f.username}
                        />
                      </Link>
                      <div className="flex">
                        {f.has_review && (
                          <ReviewIcon isOn className=" w-5 h-5" />
                        )}
                        {f.favorited && (
                          <FavoriteHeart isOn className=" w-5 h-5" />
                        )}
                      </div>
                    </div>
                    <span className="text-xs mt-1 group-hover:visible invisible">{`@${f.username}`}</span>
                  </div>
                ))
              ) : (
                <div className="text-slate-600 italic text-sm">
                  No one you follow has watched this yet
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
