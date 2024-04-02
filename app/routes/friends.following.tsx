import { Link, useLoaderData } from "@remix-run/react";
import { LoaderFunctionArgs, json } from "@vercel/remix";
import { getUserOrRedirect } from "~/features/auth/user.server";
import { getFollowing } from "~/features/friends/get.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const response = new Response();
  const user = await getUserOrRedirect({ request, response });
  const following = await getFollowing({ userId: user.id });
  return json(following, { headers: response.headers });
}

function Empty() {
  return <div>No followers</div>;
}

export default function Followers() {
  const following = useLoaderData<typeof loader>();

  return (
    <div>
      {!following ? (
        <Empty />
      ) : (
        <ul className="pt-4">
          {following.map((f) => {
            const displayName = f.first_name
              ? `${f.first_name}${f.last_name ? ` ${f.last_name}` : ""} `
              : `@${f.username}`;

            return (
              <li className="flex-col md:flex-row gap-1 md:gap-3 flex md:items-end">
                <Link to={`/${f.username}`} className="flex items-center gap-3">
                  {f.avatar && (
                    <img
                      className="w-10 h-10 rounded-full"
                      src={f.avatar}
                      alt={f.username}
                    />
                  )}
                  <div className="flex-col flex">
                    <span className="whitespace-nowrap text-base">
                      {displayName}
                    </span>
                    <span className="text-xs text-gray-500 whitespace-nowrap">{`Joined ${f.created_date}`}</span>
                  </div>
                </Link>

                <div className="ml-[50px] md:ml-10 flex divide-x divide-slate-300">
                  <Link
                    prefetch="intent"
                    to={`/${f.username}?type=movie`}
                    className="pr-4"
                  >
                    <span className="font-bold text-base md:text-lg mr-1.5">
                      {f.movie_count}
                    </span>
                    movies
                  </Link>
                  <Link
                    prefetch="intent"
                    to={`/${f.username}?type=book`}
                    className="px-4"
                  >
                    <span className="font-bold text-base md:text-lg mr-1.5">
                      {f.book_count}
                    </span>
                    books
                  </Link>
                  <Link
                    prefetch="intent"
                    to={`/${f.username}?type=tv`}
                    className="px-4"
                  >
                    <span className="font-bold md:text-large text-base mr-1.5">
                      {f.tv_count}
                    </span>
                    seasons
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
