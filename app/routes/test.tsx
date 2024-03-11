import { useLoaderData } from "@remix-run/react";
import { json } from "@vercel/remix";
import {
  getEntriesOwnerAndCounts,
  getEntryCounts,
} from "~/features/list/db/entries";

export async function loader() {
  let [entries, counts] = await Promise.all([
    getEntriesOwnerAndCounts({ username: "adam" }),
    getEntryCounts({ username: "adam" }),
  ]);

  return json({ entries, counts });
}

export default function Test() {
  const data = useLoaderData<typeof loader>();
  return (
    <div className="p-20">
      <pre>{JSON.stringify(data.entries, null, 2)}</pre>
    </div>
  );
}
