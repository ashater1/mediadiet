import { Outlet, useLoaderData } from "@remix-run/react";
import { LoaderFunctionArgs } from "@vercel/remix";
import { redirect } from "remix-typedjson";
import { db } from "~/db.server";
import { getUserDetails, getUserOrRedirect } from "~/features/auth/auth.server";
import { getAvatarUrl, useUserContext } from "~/features/auth/context";
import { getFollowers } from "~/features/friends/db";
import {
  ItemsCountAndFilter,
  UserHeaderBar,
} from "~/features/list/components/listOwnerHeaderBar";
import { PageFrame } from "~/features/ui/frames";

export async function loader({ request }: LoaderFunctionArgs) {
  const response = new Response();
  let user = await getUserDetails({ request, response });

  if (!user) {
    throw redirect("/login");
  }

  let followers = await getFollowers(user.username);
  return followers;
}

export default function Friends() {
  const user = useUserContext();
  let data = useLoaderData<typeof loader>();

  return (
    <PageFrame>
      <div className="w-full flex flex-col">
        <div className="flex">
          <UserHeaderBar
            isSelf={true}
            avatar={user?.avatar ?? null}
            primaryName={user?.firstName ?? null}
            secondaryName={user?.username ?? ""}
          />

          <ItemsCountAndFilter
            paramName="type"
            counts={[1, 2]}
            labels={[{ label: "following" }, { label: "followers" }]}
          />
        </div>

        <pre>{JSON.stringify(data, null, 2)}</pre>

        <div className="mt-2.5 mb-2.5 border-b border-b-primary-800/20 md:mt-4 md:mb-4" />
        <Outlet />
      </div>
    </PageFrame>
  );
}
