import { useLoaderData } from "@remix-run/react";
import { LoaderFunctionArgs, SerializeFrom, json } from "@vercel/remix";
import invariant from "tiny-invariant";
import { getUserDetails } from "~/features/auth/auth.server";
import { getAvatarUrl } from "~/features/auth/context";
import { EmptyState } from "~/features/list/components/emptyState";
import {
  ItemsCountAndFilter,
  UserHeaderBar,
} from "~/features/list/components/listUserHeaderBar";
import { UserEntriesTable } from "~/features/list/components/userEntriesTable";
import { getEntriesOwnerAndCounts } from "~/features/list/db/entries";
import { getEntryTypesFromUrl } from "~/features/list/utils";

export type UserData = SerializeFrom<typeof loader>;

export async function loader({ request, params }: LoaderFunctionArgs) {
  const response = new Response();

  //   Get username from URL and fetch the users entries and counts
  const username = params.username;
  invariant(username, "userId is required");

  //   Check if url has filters & filter data if it does
  const entryTypes = getEntryTypesFromUrl(request.url);

  const [entriesOwnerAndCounts, user] = await Promise.all([
    getEntriesOwnerAndCounts({
      username,
      entryTypes,
    }),
    getUserDetails({ request, response }),
  ]);

  //  If the user doesn't exist, throw a 404
  if (!entriesOwnerAndCounts.entriesAndListUser.userFound) {
    throw new Response(null, {
      status: 404,
      statusText: "Not Found",
    });
  }

  // If the user that is logged in is the same as the user that is being viewed, isSelf is true
  return json({
    counts: entriesOwnerAndCounts.counts,
    entries: entriesOwnerAndCounts.entriesAndListUser.entries,
    isSelf: user?.username === username,
    user: entriesOwnerAndCounts.entriesAndListUser.user,
  });
}

export default function UserIndex() {
  const data = useLoaderData<typeof loader>();

  const userName =
    !data.user?.firstName && !data.user?.lastName
      ? null
      : !data.user?.lastName
      ? data.user.firstName
      : `${data.user?.firstName} ${data.user?.lastName}`;

  return (
    <div className="flex w-full flex-col">
      <div className="flex-col md:flex-row md:flex">
        <UserHeaderBar
          avatar={getAvatarUrl(data.user?.avatar) ?? undefined}
          primaryText={userName}
          secondaryText={`@${data.user?.username}`}
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
        {data.entries?.length ? (
          <UserEntriesTable data={data} />
        ) : (
          <EmptyState
            isSelf={data.isSelf}
            name={data.user?.firstName ?? data.user?.username ?? ""}
          />
        )}
      </div>
    </div>
  );
}
