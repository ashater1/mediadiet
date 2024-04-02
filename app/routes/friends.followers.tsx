import { useLoaderData } from "@remix-run/react";
import { LoaderFunctionArgs, json } from "@vercel/remix";
import { getUserOrRedirect } from "~/features/auth/user.server";
import { getFollowers } from "~/features/friends/get.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const response = new Response();
  const user = await getUserOrRedirect({ request, response });
  const followers = await getFollowers({ userId: user.id });

  return json(followers, { headers: response.headers });
}

function Empty() {
  return <div>No followers</div>;
}

export default function Followers() {
  const followers = useLoaderData<typeof loader>();

  return (
    <div>
      {!followers.length ? (
        <Empty />
      ) : (
        <pre>{JSON.stringify(followers, null, 2)}</pre>
      )}
    </div>
  );
}
