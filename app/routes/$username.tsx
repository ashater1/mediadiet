import { Outlet, useLoaderData, useOutletContext } from "@remix-run/react";
import { LoaderFunctionArgs, SerializeFrom } from "@vercel/remix";
import invariant from "tiny-invariant";
import { db } from "~/db.server";
import { getUserDetails } from "~/features/auth/auth.server";
import { getAvatarUrl } from "~/features/auth/context";
import { PageFrame } from "~/features/ui/frames";

export type ListOwnerContextType = {
  listOwner: SerializeFrom<typeof loader>["listOwner"];
  isSelf: SerializeFrom<typeof loader>["isSelf"];
};

export function useListOwnerContext() {
  return useOutletContext<ListOwnerContextType>();
}

export async function loader({ request, params }: LoaderFunctionArgs) {
  const response = new Response();
  //   Get username from URL and fetch the users entries and counts
  const username = params.username;
  invariant(username, "userId is required");

  const [listOwner, user] = await Promise.all([
    db.user.findFirst({
      where: {
        username,
      },
    }),
    getUserDetails({ request, response }),
  ]);

  if (!listOwner) {
    throw new Response(null, {
      status: 404,
      statusText: "User not Found",
    });
  }

  return {
    isSelf: user?.username === username,
    listOwner: {
      ...listOwner,
      avatar: listOwner.avatar && listOwner.avatar,
    },
  };
}

export default function User() {
  let data = useLoaderData<typeof loader>();

  return (
    <PageFrame>
      <Outlet context={data satisfies ListOwnerContextType} />
    </PageFrame>
  );
}
