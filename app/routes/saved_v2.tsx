import { ClockIcon } from "@heroicons/react/20/solid";
import { PlusIcon } from "@heroicons/react/24/outline";
import { NavLink, useLoaderData } from "@remix-run/react";
import { LoaderFunctionArgs, json, redirect } from "@vercel/remix";
import { db } from "~/db.server";
import { getUserDetails } from "~/features/auth/auth.server";
import { BookIcon, MovieIcon, TvShowIcon } from "~/features/list/icons/icons";
import { getMediaTypesFromUrl } from "~/features/list/utils";
import { PageFrame, PageHeader } from "~/features/ui/frames";
import { formatSavedItem, getSavedItems } from "~/features/v2/saved/db";

export async function loader({ request }: LoaderFunctionArgs) {
  const response = new Response();
  const user = await getUserDetails({ request, response });

  if (!user) throw redirect("/login", { headers: response.headers });
  const mediaTypes = getMediaTypesFromUrl(request.url);

  //   TODO: Migrate supabase db to use MediaItemForLater instead of individual tables
  const saved = await getSavedItems({
    username: user.username,
    mediaTypes,
  });

  const formattedSaved = saved?.map(formatSavedItem);

  return json({ data: formattedSaved });
}

export default function Saved() {
  const data = useLoaderData<typeof loader>();

  return (
    <PageFrame>
      <div className="flex w-full flex-col">
        <div className="relative flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
          <div className="flex">
            <PageHeader>
              <ClockIcon className="mr-3 h-8 w-8 fill-primary-700" />
              Saved For Later
            </PageHeader>
            <NavLink to="add" className="flex items-center">
              <button className="text-sm text-white flex items-center justify-center gap-2 rounded px-2 py-1 bg-primary-800 hover:bg-primary-700 active:bg-primary-600 ml-4">
                <PlusIcon className="h-4 w-4" />
              </button>
            </NavLink>
          </div>

          <div className="md:ml-auto">
            {/* <ItemsCountAndFilter
                paramName="type"
                counts={[data.movieCount, data.bookCount, data.tvCount]}
                labels={[
                  { label: "movie" },
                  { label: "book" },
                  { label: "show" },
                ]}
              /> */}
          </div>
        </div>

        <div className="mt-3 border-b border-b-slate-400 md:mt-6" />

        <ul className="mt-6 flex flex-col gap-4 md:gap-8">
          {data.data?.map((d) => (
            <li key={d.id} className="flex items-center gap-6 md:gap-8">
              <div>
                {d.mediaItem.mediaType === "BOOK" ? (
                  <BookIcon />
                ) : d.mediaItem.mediaType === "MOVIE" ? (
                  <MovieIcon />
                ) : d.mediaItem.mediaType === "TV" ? (
                  <TvShowIcon />
                ) : null}
              </div>
              <div className="flex flex-col">
                <div className="text-sm font-semibold line-clamp-2 md:text-base">
                  {d.mediaItem.title}
                </div>
                <div className="flex flex-col items-baseline gap-0.5 md:mt-1 md:flex-row  md:gap-4">
                  {d.mediaItem.creator?.length && (
                    <div className="text-sm">{d.mediaItem.creator}</div>
                  )}
                  <div className="text-xs text-gray-500">
                    Added on {d.createdAt}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </PageFrame>
  );
}
