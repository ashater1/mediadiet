import { ClockIcon } from "@heroicons/react/20/solid";
import { PlusIcon } from "@heroicons/react/24/outline";
import {
  Form,
  NavLink,
  Outlet,
  useFetcher,
  useLoaderData,
  useLocation,
  useSubmit,
} from "@remix-run/react";
import { LoaderFunctionArgs, json, redirect } from "@vercel/remix";
import { useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { PageFrame, PageHeader } from "~/components/frames";
import { CountsWithParams } from "~/components/headerbar/count";
import Spinner from "~/components/spinner";
import { cn } from "~/components/utils";
import { getUserDetails } from "~/features/auth/user.server";
import { BookIcon, MovieIcon, TvShowIcon } from "~/features/list/icons/icons";
import { getMediaTypesFromUrl } from "~/features/list/utils.server";
import { deleteSavedItem } from "~/features/saved/delete.server";
import {
  formatSavedItem,
  getSavedCounts,
  getSavedItems,
} from "~/features/saved/get.server";
import { setToast } from "~/features/toasts/toast.server";
import { useOptimisticParams } from "~/utils/useOptimisticParams";

export async function loader({ request }: LoaderFunctionArgs) {
  const response = new Response();
  const user = await getUserDetails({ request, response });

  if (!user) throw redirect("/login", { headers: response.headers });
  const mediaTypes = getMediaTypesFromUrl(request.url);

  const url = new URL(request.url);
  let page = url.searchParams.get("page");
  console.log({ page });
  let pageNumber = page ? parseInt(page) ?? 1 : 1;

  const [saved, counts] = await Promise.all([
    getSavedItems({
      username: user.username,
      mediaTypes,
      take: 31,
      skip: (pageNumber - 1) * 30,
    }),
    getSavedCounts({ username: user.username }),
  ]);

  const formattedSaved = saved.map(formatSavedItem);

  return json({
    saved: formattedSaved,
    counts,
  });
}

export async function action({ request }: LoaderFunctionArgs) {
  const response = new Response();

  const user = await getUserDetails({ request, response });
  if (!user) throw redirect("/login", { headers: response.headers });

  // TODO - Authenticate the user owns the saved item being deleted
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
  const [dataState, setDataState] = useState<typeof data.saved>(() => []);

  const { isLoading, getAllParams } = useOptimisticParams();
  const mediaTypes = getAllParams("type");

  const infiniteScrollRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(infiniteScrollRef);

  let [page, setPage] = useState(1);
  let [allItemsLoaded, setAllItemsLoaded] = useState(data.saved.length < 31);
  const savedItemsFetcher = useFetcher<typeof loader>();

  const { search } = useLocation();

  useEffect(() => {
    setPage(1);
    setDataState([]);
    setAllItemsLoaded(false);
  }, [search]);

  useEffect(() => {
    if (
      !isInView ||
      savedItemsFetcher.state === "loading" ||
      data.saved.length !== 31 ||
      allItemsLoaded
    ) {
      return;
    }

    setPage((p) => p + 1);

    if (mediaTypes.length) {
      let searchParams = new URLSearchParams();
      mediaTypes.forEach((t) => searchParams.append("type", t.toString()));
      savedItemsFetcher.load(`/saved?page=${page + 1}&${searchParams}`);
      return;
    }
    savedItemsFetcher.load(`/saved?page=${page + 1}`);
  }, [isInView]);

  useEffect(() => {
    if (savedItemsFetcher.data?.saved) {
      let data = [...savedItemsFetcher.data.saved].slice(0, 30);
      setDataState((d) => [...d, ...data]);
      if (savedItemsFetcher.data.saved.length < 31) {
        setAllItemsLoaded(true);
      }
    }
  }, [savedItemsFetcher.data]);

  return (
    <>
      <PageFrame>
        <div className="pb-6 flex w-full flex-col">
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

          <ul key={search} className="mt-6 flex flex-col gap-4 md:gap-8">
            {[...data.saved.slice(0, 30), ...dataState].map((d) => (
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
                    {d.mediaItem.mediaType == "TV"
                      ? d.mediaItem.TvSeries?.title
                      : d.mediaItem.title}
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
          <div
            ref={infiniteScrollRef}
            className={cn(
              data.saved.length !== 31 || allItemsLoaded
                ? "hidden"
                : "flex items-center justify-center py-6 w-full"
            )}
          >
            <Spinner className="w-6 h-6" />
          </div>
        </div>
      </PageFrame>
      <Outlet />
    </>
  );
}
