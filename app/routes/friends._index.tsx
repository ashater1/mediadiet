import { useLoaderData } from "@remix-run/react";
import { LoaderFunctionArgs } from "@vercel/remix";
import { db } from "~/db.server";
import { getUserOrRedirect } from "~/features/auth/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  let response = new Response();
  let { id } = await getUserOrRedirect({ request, response });

  let followingFeed = await db.user.findFirst({
    where: { id },
    select: {
      following: {
        take: 1,
        select: {
          followed: {
            select: {
              MovieReviews: true,
              BookReviews: true,
              TvReviews: true,
            },
          },
        },
      },
    },
  });

  return { data: followingFeed };
}

export default function FriendsIndex() {
  let data = useLoaderData<typeof loader>();

  return (
    <div>
      <h2>Friends Index!</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
