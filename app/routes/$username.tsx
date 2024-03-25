import { Outlet, useLoaderData, useOutletContext } from "@remix-run/react";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  SerializeFrom,
  redirect,
} from "@vercel/remix";
import invariant from "tiny-invariant";
import { db } from "~/db.server";

import { followUserById, unfollowUserById } from "~/features/friends/follow";
import { PageFrame } from "~/features/ui/frames";
import {
  findUser,
  getAvatarUrl,
  getUserDetails,
} from "~/features/v2/auth/user.server";
import { ListOwnerContextType } from "~/features/v2/list/hooks/useListOwnerContext";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const response = new Response();
  const username = params.username;
  invariant(username, "userId is required");

  const user = await getUserDetails({ request, response });

  const listOwner = await db.user.findFirst({
    where: {
      username,
    },
    include: {
      followedBy: {
        where: {
          followerId: user?.id,
        },
      },
    },
  });

  if (!listOwner) {
    throw new Response(null, {
      status: 404,
      statusText: "User not Found",
    });
  }

  const displayName = listOwner.firstName
    ? `${listOwner.firstName}${listOwner.lastName && " " + listOwner.lastName}`
    : null;

  return {
    isSelf: user?.username === username,
    isFollowing: listOwner.followedBy.length > 0,
    listOwner: {
      ...listOwner,
      avatar: listOwner.avatar && getAvatarUrl(listOwner.avatar),
      displayName,
    },
  };
}

export async function action({ request, params }: ActionFunctionArgs) {
  const response = new Response();
  const { username } = params;

  if (!username) {
    throw new Response(null, {
      status: 404,
      statusText: "User not Found",
    });
  }

  // Get the user submitting the action, the user being followed, and the form data
  const [user, listOwner, _formData] = await Promise.all([
    getUserDetails({ request, response }),
    findUser({ username }),
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

    return { success: true as const };
  } else if (formData.intent === "unfollow") {
    const unfollow = await unfollowUserById({
      followerId: user.id,
      followedId: listOwner.id,
    });

    return { success: true as const };
  }

  return null;
}

export default function User() {
  let data = useLoaderData<typeof loader>();

  return (
    <PageFrame>
      <Outlet context={data satisfies ListOwnerContextType} />
    </PageFrame>
  );
}
