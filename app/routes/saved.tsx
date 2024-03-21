import { ClockIcon } from "@heroicons/react/20/solid";
import { PlusIcon } from "@heroicons/react/24/outline";
import {
  Form,
  NavLink,
  Outlet,
  useLoaderData,
  useSubmit,
} from "@remix-run/react";
import { LoaderFunctionArgs, json, redirect } from "@vercel/remix";
import { CountsWithParams } from "~/components/headerbar/count";
import Spinner from "~/components/spinner";
import { getUserDetails } from "~/features/auth/auth.server";
import { BookIcon, MovieIcon, TvShowIcon } from "~/features/list/icons/icons";
import { getMediaTypesFromUrl } from "~/features/list/utils";
import { setToast } from "~/features/toasts/toast.server";
import { PageFrame, PageHeader } from "~/features/ui/frames";
import { deleteSavedItem } from "~/features/v2/saved/delete";
import {
  formatSavedItem,
  getSavedCounts,
  getSavedItems,
} from "~/features/v2/saved/get";
import { useOptimisticParams } from "~/utils/useOptimisticParams";

export async function loader({ request }: LoaderFunctionArgs) {
  const response = new Response();
  const user = await getUserDetails({ request, response });

  if (!user) throw redirect("/login", { headers: response.headers });
  const mediaTypes = getMediaTypesFromUrl(request.url);

  //   TODO: Migrate supabase db to use MediaItemForLater instead of individual tables
  const [saved, counts] = await Promise.all([
    getSavedItems({
      username: user.username,
      mediaTypes,
    }),
    getSavedCounts({ username: user.username }),
  ]);

  const formattedSaved = saved?.map(formatSavedItem);

  return json({ saved: formattedSaved, counts });
}

export async function action({ request }: LoaderFunctionArgs) {
  const response = new Response();

  const user = await getUserDetails({ request, response });
  if (!user) throw redirect("/login", { headers: response.headers });

  const formData = await request.formData();
  const id = formData.get("id");

  // TODO - throw Response add status codes & reject messages
  if (!id || typeof id !== "string") throw new Error("Invalide id provided");

  // TODO - add intent & a "Move to top" option
  await deleteSavedItem(id);

  await setToast({
    request,
    response,
    toast: {
      type: "deleted",
      title: "Deleted from saved",
      description: "Item has been deleted from your saved list",
    },
  });

  throw redirect("/saved", { headers: response.headers });
}

export default function Saved() {
  const submit = useSubmit();
  const data = useLoaderData<typeof loader>();

  const { isLoading, getAllParams } = useOptimisticParams();
  const mediaTypes = getAllParams("type");

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

            <div className="md:ml-auto self-end mt-2 md:mt-0">
              <Form
                onChange={(e) => {
                  submit(e.currentTarget);
                }}
                className="w-min flex md:ml-auto self-auto md:self-end"
              >
                <div className="relative w-min flex">
                  <div className="flex divide-x divide-slate-300">
                    <CountsWithParams
                      count={data.counts.movieCount}
                      label="movies"
                      active={
                        !mediaTypes.length || mediaTypes.includes("movie")
                      }
                      defaultChecked={mediaTypes.includes("movie")}
                      name="type"
                      value="movie"
                    />

                    <CountsWithParams
                      count={data.counts.bookCount}
                      label="books"
                      defaultChecked={mediaTypes.includes("book")}
                      active={!mediaTypes.length || mediaTypes.includes("book")}
                      name="type"
                      value="book"
                    />

                    <CountsWithParams
                      count={data.counts.tvCount}
                      label="seasons"
                      defaultChecked={mediaTypes.includes("tv")}
                      active={!mediaTypes.length || mediaTypes.includes("tv")}
                      name="type"
                      value="tv"
                    />
                  </div>

                  {isLoading && (
                    <div className="absolute right-0 translate-x-full">
                      <Spinner className="w-6 h-6" />
                    </div>
                  )}
                </div>
              </Form>
            </div>
          </div>

          <div className="mt-3 border-b border-b-slate-400 md:mt-6" />

          <ul className="mt-6 flex flex-col gap-4 md:gap-8">
            {data.saved?.map((d) => (
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
      <Outlet />
    </>
  );
}
