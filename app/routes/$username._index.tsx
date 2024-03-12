import { useLoaderData } from "@remix-run/react";
import { LoaderFunctionArgs, SerializeFrom, json } from "@vercel/remix";
import invariant from "tiny-invariant";
import { EmptyState } from "~/features/list/components/empty";
import {
  ItemsCountAndFilter,
  ListOwnerHeaderBar,
} from "~/features/list/components/listOwnerHeaderBar";
import { UserEntriesTable } from "~/features/list/components/userEntriesTable";
import { getEntriesAndCounts } from "~/features/list/db/entries";
import { getEntryTypesFromUrl } from "~/features/list/utils";

export type UserData = SerializeFrom<typeof loader>["entries"];

export async function loader({ request, params }: LoaderFunctionArgs) {
  const response = new Response();

  //   Get username from URL and fetch the users entries and counts
  const username = params.username;
  invariant(username, "userId is required");

  //   Check if url has filters & filter data if it does
  const entryTypes = getEntryTypesFromUrl(request.url);

  const { entries, counts } = await getEntriesAndCounts({
    username,
    entryTypes,
  });

  if (!entries.userFound) {
    throw new Response(null, {
      status: 404,
      statusText: "User not Found",
    });
  }

  return json(
    {
      counts,
      entries: entries.entries,
    },
    {
      headers: response.headers,
    }
  );
}

export default function UserIndex() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="flex w-full flex-col">
      <div className="flex-col md:flex-row md:flex">
        <ListOwnerHeaderBar />

        <div className="ml-auto self-end mt-2 md:mt-0">
          <ItemsCountAndFilter
            paramName="type"
            counts={[
              data.counts.movieCount,
              data.counts.bookCount,
              data.counts.tvCount,
            ]}
            labels={[
              { label: "movies", searchParam: "movie" },
              { label: "books", searchParam: "book" },
              { label: "seasons", searchParam: "tv" },
            ]}
          />
        </div>
      </div>

      <div className="mt-2.5 mb-2.5 border-b border-b-primary-800/20 md:mt-4 md:mb-4" />

      <div>
        {data.entries?.length ? (
          <UserEntriesTable entries={data.entries} />
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}
