import { useLoaderData } from "@remix-run/react";
import { db } from "~/db.server";

export async function loader() {
  const result =
    await db.$queryRaw`select favorited, "tvSeasonId" as media_id from "tv_review"
union all
select favorited, "movieId" as media_id from "movie_review"
limit 20;`;

  return { loader: result };
}

export default function Test() {
  const loaderData = useLoaderData<typeof loader>();

  return (
    <div className="p-20">
      <pre>{JSON.stringify(loaderData, null, 2)}</pre>
    </div>
  );
}
