import { useLoaderData } from "@remix-run/react";
import { LoaderFunctionArgs, SerializeFrom, json } from "@vercel/remix";
import invariant from "tiny-invariant";
import { getAvatarUrl } from "~/features/auth/context";
import { EmptyState } from "~/features/list/components/emptyState";
import {
  ItemsCountAndFilter,
  UserHeaderBar,
} from "~/features/list/components/listUserHeaderBar";
import { UserEntriesTable } from "~/features/list/components/userEntriesTable";
import { getEntriesAndCounts } from "~/features/list/db/entries";
import { getEntryTypesFromUrl } from "~/features/list/utils";
import { useListOwnerContext } from "./$username";

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

  // If the user that is logged in is the same as the user that is being viewed, isSelf is true
  return json({
    counts,
    entries: entries.entries,
  });
}

export default function UserIndex() {
  const data = useLoaderData<typeof loader>();
  const { listOwner } = useListOwnerContext();

  const userName =
    !listOwner?.firstName && !listOwner?.lastName
      ? null
      : !listOwner?.lastName
      ? listOwner.firstName
      : `${listOwner?.firstName} ${listOwner?.lastName}`;

  return (
    <div className="flex w-full flex-col">
      <div className="flex-col md:flex-row md:flex">
        <UserHeaderBar
          avatar={getAvatarUrl(listOwner?.avatar) ?? undefined}
          primaryText={userName}
          secondaryText={`@${listOwner?.username}`}
        />

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
        {data.entries ? (
          <UserEntriesTable entries={data.entries} />
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}
