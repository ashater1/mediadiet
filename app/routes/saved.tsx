import { ClockIcon } from "@heroicons/react/20/solid";
import { PlusIcon } from "@heroicons/react/24/outline";
import { NavLink, Outlet, useLoaderData, useSubmit } from "@remix-run/react";
import { LoaderFunctionArgs, json, redirect } from "@vercel/remix";
import { format } from "date-fns";
import { z } from "zod";
import { db } from "~/db.server";
import { getUserDetails } from "~/features/auth/auth.server";
import { ItemsCountAndFilter } from "~/features/list/components/listUserHeaderBar";
import {
  bookReviewInclude,
  movieReviewInclude,
} from "~/features/list/db/entries_old";
import { BookIcon, MovieIcon, TvShowIcon } from "~/features/list/icons/icons";
import { MediaType } from "~/features/list/types";
import {
  deleteSavedBookItem,
  deleteSavedMovieItem,
  deleteSavedShowItem,
} from "~/features/saved/delete";
import { PageFrame, PageHeader } from "~/features/ui/frames";
import { titleize } from "~/utils/capitalize";
import { listToString, safeFilter } from "~/utils/funcs";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const response = new Response();
  const user = await getUserDetails({ request, response });
  if (!user) throw redirect("/login", { headers: response.headers });

  const saved = await db.user.findFirst({
    where: {
      username: user.username,
    },
    include: {
      BookForLater: { include: bookReviewInclude },
      MovieForLater: { include: movieReviewInclude },
      ShowForLater: { include: { tvShow: true } },
    },
  });

  if (saved === null) throw redirect("/login", { headers: response.headers });

  const types = url.searchParams.getAll("type");

  const normalizedBooks = saved.BookForLater.map((d) => ({
    ...d,
    formattedAddedAt: format(d.addedAt, "MMMM d"),
    title: titleize(d.book.title),
    creators: listToString(safeFilter(d.book.authors.map((d) => d.name))),
    mediaType: "book" as const,
  }));

  const normalizedMovies = saved.MovieForLater.map((d) => ({
    ...d,
    formattedAddedAt: format(d.addedAt, "MMMM d"),
    title: titleize(d.movie.title),
    creators: listToString(safeFilter(d.movie.directors.map((d) => d.name))),
    mediaType: "movie" as const,
  }));

  const normalizedShows = saved.ShowForLater.map((d) => ({
    ...d,
    formattedAddedAt: format(d.addedAt, "MMMM d"),
    title: titleize(d.tvShow.title ?? ""),
    creators: null,
    mediaType: "tv" as const,
  }));

  const items = [
    ...normalizedBooks,
    ...normalizedMovies,
    ...normalizedShows,
  ].sort((a, b) => b.addedAt.valueOf() - a.addedAt.valueOf());

  if (types.length && types.length < 3) {
    const filterdItems = items.filter((d) => types.includes(d.mediaType));
    return json(
      {
        items: filterdItems,
        movieCount: normalizedMovies.length,
        bookCount: normalizedBooks.length,
        tvCount: normalizedShows.length,
      },
      {
        headers: {
          ...response.headers,
        },
      }
    );
  }

  return json(
    {
      items: items,
      movieCount: normalizedMovies.length,
      bookCount: normalizedBooks.length,
      tvCount: normalizedShows.length,
    },
    {
      headers: {
        ...response.headers,
      },
    }
  );
}

const deleteSavedSchema = z.object({
  mediaType: z.enum(["book", "movie", "tv"]),
  itemId: z.string(),
});

export async function action({ request }: LoaderFunctionArgs) {
  const response = new Response();
  const user = await getUserDetails({ request, response });
  if (!user) throw redirect("/login", { headers: response.headers });

  const formData = Object.fromEntries(await request.formData());
  const { itemId, mediaType } = deleteSavedSchema.parse(formData);

  if (mediaType === "book") {
    await deleteSavedBookItem({
      itemId: itemId,
    });
    throw redirect("/saved", { headers: response.headers });
  }

  if (mediaType === "movie") {
    await deleteSavedMovieItem({
      itemId: itemId,
    });
    throw redirect("/saved", { headers: response.headers });
  }

  if (mediaType === "tv") {
    await deleteSavedShowItem({
      itemId: itemId,
    });
    throw redirect("/saved", { headers: response.headers });
  }

  return null;
}

export default function Saved() {
  const data = useLoaderData<typeof loader>();
  const submit = useSubmit();

  const handleDelete = ({
    mediaType,
    itemId,
  }: {
    mediaType: MediaType;
    itemId: string;
  }) => {
    submit({ mediaType, itemId }, { method: "post" });
  };

  return (
    <>
      <PageFrame>
        <div className="flex w-full flex-col">
          <div className="relative flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
            <div className="flex">
              <PageHeader>
                <ClockIcon className="mr-3 h-8 w-8 fill-primary-500" />
                Saved For Later
              </PageHeader>
              <NavLink to="add" className="flex items-center">
                <button className="text-sm text-white flex items-center justify-center gap-2 rounded px-2 py-1 bg-primary-800 hover:bg-primary-700 active:bg-primary-600 ml-4">
                  <PlusIcon className="h-4 w-4" />
                </button>
              </NavLink>
            </div>

            <div className="md:ml-auto">
              <ItemsCountAndFilter
                paramName="type"
                counts={[data.movieCount, data.bookCount, data.tvCount]}
                labels={[
                  { label: "movie" },
                  { label: "book" },
                  { label: "show" },
                ]}
              />
            </div>
          </div>

          <div className="mt-3 border-b border-b-slate-400 md:mt-6" />

          <ul className="mt-6 flex flex-col gap-4 md:gap-8">
            {data.items.map((d) => (
              <li key={d.id} className="flex items-center gap-6 md:gap-8">
                <div>
                  {d.mediaType === "book" ? (
                    <BookIcon />
                  ) : d.mediaType === "movie" ? (
                    <MovieIcon />
                  ) : d.mediaType === "tv" ? (
                    <TvShowIcon />
                  ) : null}
                </div>
                <div className="flex flex-col">
                  <div className="text-sm font-semibold line-clamp-2 md:text-base">
                    {d.title}
                  </div>
                  <div className="flex flex-col items-baseline gap-0.5 md:mt-1 md:flex-row  md:gap-4">
                    {d.creators?.length && (
                      <div className="text-sm">{d.creators}</div>
                    )}
                    <div className="text-xs text-gray-500">
                      Added on {d.formattedAddedAt}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </PageFrame>
      <Outlet />
    </>
  );
}
