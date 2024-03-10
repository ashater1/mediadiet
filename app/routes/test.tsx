import { useLoaderData } from "@remix-run/react";
import { json } from "@vercel/remix";
import { db } from "~/db.server";

export async function loader() {
  const movieItems = await db.movieReview.findMany({
    where: {
      userId: "5369ff92-0b32-4c72-8da4-6eb805226326",
    },
    take: 10,
    orderBy: {
      consumedDate: "desc",
    },
    include: {
      movie: {
        include: {
          MovieReview: {
            select: {
              consumedDate: true,
            },
            orderBy: {
              consumedDate: "asc",
            },
            where: {
              userId: "5369ff92-0b32-4c72-8da4-6eb805226326",
            },
            take: 1,
          },
          _count: {
            select: {
              MovieReview: {
                where: {
                  userId: "5369ff92-0b32-4c72-8da4-6eb805226326",
                },
              },
            },
          },
          directors: true,
        },
      },
    },
  });

  return json(movieItems);
}

export default function Test() {
  const data = useLoaderData<typeof loader>();
  return (
    <div className="p-20">
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
