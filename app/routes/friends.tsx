import { Count } from "~/components/headerbar/count";
import { getCounts } from "~/features/friends/counts";
import { getUserDetails } from "~/features/auth/user.server";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { ListOwnerHeaderBar } from "~/features/list/components/listOwnerHeaderBar";
import { LoaderFunctionArgs, json } from "@vercel/remix";
import { PageFrame } from "~/components/frames";
import { redirect } from "remix-typedjson";
import { useUserContext } from "~/features/auth/context";
import { MagnifyingGlassCircleIcon } from "@heroicons/react/24/outline";

export async function loader({ request }: LoaderFunctionArgs) {
  const response = new Response();
  let user = await getUserDetails({ request, response });

  if (!user) {
    throw redirect("/login");
  }

  let counts = await getCounts(user.username);
  return json(counts, { headers: response.headers });
}

export default function Friends() {
  const user = useUserContext();
  let data = useLoaderData<typeof loader>();

  return (
    <PageFrame>
      <div className="w-full flex flex-col">
        <div className="flex flex-col md:flex-row">
          <ListOwnerHeaderBar
            isAuthed={true}
            isSelf={true}
            isFollowing={false}
            avatar={user?.avatar ?? null}
            primaryName={
              user?.firstName ? `${user.firstName} ${user.lastName}` : null
            }
            secondaryName={user?.username ?? ""}
          />

          <div className="md:self-end md:ml-auto mt-2">
            <div className="relative w-min items-center flex">
              <div className="flex divide-x divide-slate-300">
                <Link to="followers" className="px-4 pl-0">
                  <Count count={data.followedBy} label="followers" />
                </Link>

                <Link to="following" className="px-4">
                  <Count count={data.following} label="following" />
                </Link>
              </div>
              <div className="md:mr-5 flex text-sm whitespace-nowrap items-center">
                <MagnifyingGlassCircleIcon className="w-8 h-8 stroke-1 stroke-gray-900" />
                Find user
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
