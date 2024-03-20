import { LoaderFunctionArgs } from "@vercel/remix";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { db } from "~/db.server";
import { UserEntriesTable } from "~/features/list/components/userEntriesTable_V2";
import {
  formatEntries,
  getEntries,
} from "~/features/v2/list/entries_v2.server";
import { PageFrame } from "~/features/ui/frames";
import { getEntryListCounts } from "~/features/v2/list/counts";

async function getCounts() {
  const counts = await getEntryListCounts();
  return counts;
}

export async function loader({ request, params }: LoaderFunctionArgs) {
  const username = "adam";
  const counts = await getCounts();
  return typedjson({ counts });
  // if (!username) {
  //   throw new Response(null, {
  //     status: 404,
  //     statusText: "User not Found",
  //   });
  // }

  // const entries = await getEntries({ username });
  // const formattedEntries = entries?.Review.map(formatEntries);
  // return typedjson({ data: formattedEntries });
}

export default function Test() {
  const data = useTypedLoaderData<typeof loader>();

  return (
    <PageFrame>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      {/* <UserEntriesTable entries={data.data ?? []} /> */}
    </PageFrame>
  );
}
