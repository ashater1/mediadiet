import { useLoaderData } from "@remix-run/react";
import { json } from "@vercel/remix";
import { db } from "~/db.server";

export async function loader() {
  const result = await db.user.findFirst({
    where: {
      username: "adam",
    },
    select: {
      Review: {
        include: {
          MediaItem: {
            include: {
              TvSeries: true,
            },
          },
        },
        take: 5,
        orderBy: {
          consumedDate: "desc",
        },
      },
    },
  });

  return json(result);
}

export default function Test() {
  const loaderData = useLoaderData<typeof loader>();

  return (
    <div className="p-20">
      <pre>{JSON.stringify(loaderData, null, 2)}</pre>
    </div>
  );
}
