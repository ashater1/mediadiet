import { Outlet, useLoaderData, useOutletContext } from "@remix-run/react";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  SerializeFrom,
  redirect,
} from "@vercel/remix";
import invariant from "tiny-invariant";
import { db } from "~/db.server";
import { getUserByUsername, getUserDetails } from "~/features/auth/auth.server";
import { getAvatarUrl } from "~/features/auth/context";
import { followUserById, unfollowUserById } from "~/features/friends/follow";
import { PageFrame } from "~/features/ui/frames";

// export type ListOwnerContextType = {
//   listOwner: SerializeFrom<typeof loader>["listOwner"];
//   isSelf: SerializeFrom<typeof loader>["isSelf"];
//   isFollowing: SerializeFrom<typeof loader>["isFollowing"];
// };

export type ListOwnerContextType = SerializeFrom<typeof loader>;

export function useListOwnerContext() {
  return useOutletContext<ListOwnerContextType>();
}

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
    console.log("Following user");
    const follow = await followUserById({
      followerId: user.id,
      followedId: listOwner.id,
    });

    return true;
  } else if (formData.intent === "unfollow") {
    console.log("Unfollowing user");
    const unfollow = await unfollowUserById({
      followerId: user.id,
      followedId: listOwner.id,
    });

    return true;
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
