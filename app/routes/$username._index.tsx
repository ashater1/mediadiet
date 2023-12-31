import * as ContextMenu from "@radix-ui/react-context-menu";
import { useLoaderData } from "@remix-run/react";
import { LoaderFunctionArgs, SerializeFrom, json } from "@vercel/remix";
import classNames from "classnames";
import React from "react";
import invariant from "tiny-invariant";
import { z } from "zod";
import { getUserDetails } from "~/features/auth/auth.server";
import { getAvatarUrl } from "~/features/auth/context";
import { EmptyState } from "~/features/list/components/emptyState";
import { UserHeaderBar } from "~/features/list/components/listUserHeaderBar";
import { UserEntriesTable } from "~/features/list/components/userEntriesTable";
import { getUserEntriesAndCounts } from "~/features/list/db/entries";

export type UserData = SerializeFrom<typeof loader>;

const entryTypesSchema = z.array(z.enum(["book", "movie", "tv"]));

function getEntryTypesFromUrl(url: string) {
  //   Check if url has filters & filter data if it does
  const _url = new URL(url);
  const entryTypes = _url.searchParams.getAll("type");
  const parsedEntryTypes = entryTypesSchema.parse(entryTypes);
  return parsedEntryTypes;
}

export async function loader({ request, params }: LoaderFunctionArgs) {
  const response = new Response();

  //   Get username from URL and fetch the users entries and counts
  const username = params.username;
  invariant(username, "userId is required");

  //   Check if url has filters & filter data if it does
  const entryTypes = getEntryTypesFromUrl(request.url);

  //   Get the data for the user's page
  const [data, user] = await Promise.all([
    getUserEntriesAndCounts({ username, entryTypes }),
    getUserDetails({ request, response }),
  ]);

  //  If the user doesn't exist, throw a 404
  if (!data.userFound) {
    throw new Response(null, {
      status: 404,
      statusText: "Not Found",
    });
  }

  // If the user that is logged in is the same as the user that is being viewed, isSelf is true
  const isSelf = user?.username === username;

  return json({
    counts: data.counts,
    entries: data.entries,
    isSelf,
    user: data.userInfo,
  });
}

export default function UserIndex() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="flex w-full flex-col">
      <UserHeaderBar
        avatar={getAvatarUrl(data.user.avatar) ?? undefined}
        username={data.user.username}
        firstName={data.user?.firstName}
        lastName={data.user?.lastName}
        moiveCount={data.counts.movies}
        bookCount={data.counts.books}
        tvCount={data.counts.tv}
      />

      <div className="mt-2.5 mb-2.5 border-b border-b-primary-800/20 md:mt-4 md:mb-4" />

      <div>
        {data.entries.length ? (
          <UserEntriesTable data={data} />
        ) : (
          <EmptyState
            isSelf={data.isSelf}
            name={data.user.firstName ?? data.user.username}
          />
        )}
      </div>
    </div>
  );
}
