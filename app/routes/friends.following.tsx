import { Link, useLoaderData } from "@remix-run/react";
import { LoaderFunctionArgs, json } from "@vercel/remix";
import { getUserOrRedirect } from "~/features/auth/user.server";
import { Friend } from "~/features/friends/friendsList";
import { getFollowing } from "~/features/friends/get.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const response = new Response();
  const user = await getUserOrRedirect({ request, response });
  const following = await getFollowing({ userId: user.id });
  return json(following, { headers: response.headers });
}

function Empty() {
  return <div>Not following anyone yet</div>;
}

export default function Followers() {
  const following = useLoaderData<typeof loader>();

  return (
    <div>
      {!following.length ? (
        <Empty />
      ) : (
        <ul className="pt-4">
          {following.map((f) => (
            <Friend {...f} />
          ))}
        </ul>
      )}
    </div>
  );
}
