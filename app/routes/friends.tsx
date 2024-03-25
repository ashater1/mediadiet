import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { LoaderFunctionArgs } from "@vercel/remix";
import { redirect } from "remix-typedjson";
import { Count } from "~/components/headerbar/count";
import { getUserDetails } from "~/features/v2/auth/user.server";
import { useUserContext } from "~/features/auth/context";
import { getCounts } from "~/features/friends/counts";
import { UserHeaderBar } from "~/features/list/components/listOwnerHeaderBar";
import { PageFrame } from "~/features/ui/frames";

export async function loader({ request }: LoaderFunctionArgs) {
  const response = new Response();
  let user = await getUserDetails({ request, response });

  if (!user) {
    throw redirect("/login");
  }

  let followers = await getCounts(user.username);
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
            isFollowing={false}
            avatar={user?.avatar ?? null}
            primaryName={
              user?.firstName ? `${user.firstName} ${user.lastName}` : null
            }
            secondaryName={user?.username ?? ""}
          />

          <div className="md:ml-auto self-end mt-2 md:mt-0">
            <div className="relative w-min flex">
              <div className="flex divide-x divide-slate-300">
                <Link to="followers" className="px-4 pl:0">
                  <Count count={data.followedBy} label="followers" />
                </Link>

                <Link to="following" className="px-4">
                  <Count count={data.following} label="following" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-2.5 mb-2.5 border-b border-b-primary-800/20 md:mt-4 md:mb-4" />
        <Outlet />
      </div>
    </PageFrame>
  );
}
