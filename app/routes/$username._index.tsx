import { Form, useLoaderData, useSubmit } from "@remix-run/react";
import { LoaderFunctionArgs, SerializeFrom, json } from "@vercel/remix";
import { CountsWithParams } from "~/components/headerbar/count";
import Spinner from "~/components/spinner";
import { EmptyState } from "~/features/list/components/empty";
import { getEntryTypesFromUrl } from "~/features/list/utils";
import { UserHeaderBar } from "~/features/list/components/listOwnerHeaderBar";
import { useOptimisticParams } from "~/utils/useOptimisticParams";
import { useListOwnerContext } from "./$username";
import { getEntryListCounts } from "~/features/v2/list/counts.server";
import { formatEntries, getEntries } from "~/features/v2/list/entries.server";
import invariant from "tiny-invariant";
import { UserEntriesTable } from "~/features/list/components/userEntriesTable_V2";

export type UserData = SerializeFrom<typeof loader>["entries"];

export async function loader({ request, params }: LoaderFunctionArgs) {
  const response = new Response();

  //   Get username from URL and fetch the users entries and counts
  const username = params.username;
  invariant(username, "Username is required");

  //   Check if url has filters & filter data if it does
  const entryTypes = getEntryTypesFromUrl(request.url);

  const [counts, entries] = await Promise.all([
    getEntryListCounts(),
    getEntries({ username, mediaTypes: entryTypes }),
  ]);

  const formattedEntries = entries?.map(formatEntries);
  // TODO: update get entries to return a userFound boolean that can trigger a 404 response
  return json(
    { counts, entries: formattedEntries },
    { headers: response.headers }
  );
}

export default function UserIndex() {
  const data = useLoaderData<typeof loader>();
  const submit = useSubmit();
  const { isLoading, getAllParams } = useOptimisticParams();

  const mediaTypes = getAllParams("type");
  const { listOwner, isSelf, isFollowing } = useListOwnerContext();

  return (
    <div className="flex w-full flex-col">
      <div className="flex-col md:flex-row md:flex">
        <UserHeaderBar
          isSelf={isSelf}
          isFollowing={isFollowing}
          avatar={listOwner.avatar}
          primaryName={listOwner.displayName}
          secondaryName={listOwner.username}
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
        {data.entries.length ? (
          <UserEntriesTable entries={data.entries} />
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}
