import { Form, useLocation, useSubmit } from "@remix-run/react";
import { LoaderFunctionArgs, SerializeFrom } from "@vercel/remix";
import { useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  typedjson,
  useTypedFetcher,
  useTypedLoaderData,
} from "remix-typedjson";
import invariant from "tiny-invariant";
import { CountsWithParams } from "~/components/headerbar/count";
import Spinner from "~/components/spinner";
import { cn } from "~/components/utils";
import { useUserContext } from "~/features/auth/context";
import { EmptyState } from "~/features/list/components/empty";
import { ListOwnerHeaderBar } from "~/features/list/components/listOwnerHeaderBar";
import { UserEntriesTable } from "~/features/list/components/userEntriesTable";
import { getEntryListCounts } from "~/features/list/counts.server";
import { formatEntries, getEntries } from "~/features/list/entries.server";
import { useListOwnerContext } from "~/features/list/hooks/useListOwnerContext";
import { getMediaTypesFromUrl } from "~/features/list/utils.server";
import { useOptimisticParams } from "~/utils/useOptimisticParams";
import { usePagination } from "~/utils/usePagination";

export type UserData = SerializeFrom<typeof loader>["entries"];

export async function loader({ request, params }: LoaderFunctionArgs) {
  const response = new Response();

  //   Get username from URL and fetch the users entries and counts
  const username = params.username;
  invariant(username, "Username is required");

  //   Check if url has filters & filter data if it does
  const mediaTypes = getMediaTypesFromUrl(request.url);

  const url = new URL(request.url);
  let page = url.searchParams.get("page");
  let pageNumber = page ? parseInt(page) ?? 1 : 1;

  const [counts, entries] = await Promise.all([
    getEntryListCounts({ username }),
    getEntries({
      username,
      mediaTypes,
      take: 31,
      skip: (pageNumber - 1) * 30,
    }),
  ]);

  const formattedEntries = entries?.map(formatEntries);
  // TODO: update get entries to return a userFound boolean that can trigger a 404 response

  return typedjson(
    { counts, entries: formattedEntries },
    { headers: response.headers }
  );
}

export default function UserIndex() {
  const data = useTypedLoaderData<typeof loader>();
  const [dataState, setDataState] = useState<typeof data.entries>(() => []);

  const submit = useSubmit();
  const { isLoading, getAllParams } = useOptimisticParams();
  const mediaTypes = getAllParams("type");

  const { listOwner, isSelf, isFollowing } = useListOwnerContext();
  const user = useUserContext();

  const { page, resetPage, infiniteScrollRef, isInView } = usePagination({
    callback: ({ page }) => {
      if (activityItemsFetcher.state === "loading" || allItemsLoaded) {
        return;
      }

      if (mediaTypes.length) {
        let searchParams = new URLSearchParams();
        mediaTypes.forEach((t) => searchParams.append("type", t.toString()));
        activityItemsFetcher.load(
          `/${listOwner.username}?index&page=${page}&${searchParams}`
        );
        return;
      }
      activityItemsFetcher.load(`/${listOwner.username}?index&page=${page}`);
    },
  });

  let [allItemsLoaded, setAllItemsLoaded] = useState(data.entries.length < 31);
  const activityItemsFetcher = useTypedFetcher<typeof loader>();

  const { search } = useLocation();

  useEffect(() => {
    resetPage();
    setDataState([]);
    setAllItemsLoaded(false);
  }, [search]);

  useEffect(() => {
    if (activityItemsFetcher.data?.entries) {
      let data = [...activityItemsFetcher.data.entries].slice(0, 30);
      setDataState((d) => [...d, ...data]);
      if (activityItemsFetcher.data.entries.length < 31) {
        setAllItemsLoaded(true);
      }
    }
  }, [activityItemsFetcher.data]);

  return (
    <div className="flex w-full flex-col">
      <div className="flex-col md:flex-row md:flex">
        <ListOwnerHeaderBar
          isAuthed={!!user}
          isSelf={isSelf}
          isFollowing={isFollowing}
          avatar={listOwner.avatar}
          primaryName={listOwner.displayName}
          secondaryName={"@" + listOwner.username}
        />

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
                  active={!mediaTypes.length || mediaTypes.includes("movie")}
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

      <div className="mt-2.5 mb-2.5 border-b border-b-primary-800/20 md:mt-4 md:mb-4" />

      <div>
        {[...data.entries, ...dataState].length ? (
          <UserEntriesTable
            entries={[...data.entries.slice(0, 30), ...dataState]}
          />
        ) : (
          <EmptyState />
        )}
      </div>

      <div
        ref={infiniteScrollRef}
        className={cn(
          data.entries.length !== 31 || allItemsLoaded
            ? "hidden"
            : "flex items-center justify-center py-6 w-full"
        )}
      >
        <Spinner className="w-6 h-6" />
      </div>
    </div>
  );
}
