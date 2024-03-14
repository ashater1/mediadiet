import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { ActionFunctionArgs } from "@vercel/remix";
import { redirect } from "@vercel/remix";
import { Button } from "~/components/button";
import { getUserByUsername, getUserDetails } from "~/features/auth/auth.server";
import { followUserById, unfollowUserById } from "~/features/friends/follow";

export async function loader() {
  return { loader: null };
}

export async function action({ request }: ActionFunctionArgs) {
  const response = new Response();

  const [user, listOwner, _formData] = await Promise.all([
    getUserDetails({ request, response }),
    getUserByUsername("adam"),
    await request.formData(),
  ]);

  if (!listOwner) {
    throw new Response(null, {
      status: 404,
      statusText: "Not Found",
    });
  }

  if (!user) {
    throw redirect("/login", { headers: response.headers });
  }

  const formData = Object.fromEntries(_formData);

  if (formData.intent === "follow") {
    const follow = await followUserById({
      followerId: user.id,
      followedId: listOwner.id,
    });

    return { follow };
  } else if (formData.intent === "unfollow") {
    const unfollow = await unfollowUserById({
      followerId: user.id,
      followedId: listOwner.id,
    });

    return unfollow;
  }

  return null;
}

export default function Test() {
  const loaderData = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  return (
    <div className="p-20">
      <Form method="post" className="flex gap-4 ">
        <Button
          name="intent"
          value="follow"
          className="px-4 font-light text-lg"
        >
          <PlusCircleIcon className="mr-2 w-6 h-6 stroke-white" />
          Follow
        </Button>

        <Button
          name="intent"
          value="unfollow"
          className="px-4 font-light text-lg"
        >
          <PlusCircleIcon className="mr-2 w-6 h-6 stroke-white" />
          Unfollow
        </Button>
      </Form>
      <pre>{JSON.stringify({ ...loaderData, ...actionData }, null, 2)}</pre>
    </div>
  );
}
