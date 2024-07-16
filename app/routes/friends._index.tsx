import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import {
  MagnifyingGlassCircleIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { Link, useLoaderData } from "@remix-run/react";
import { LoaderFunctionArgs, json } from "@vercel/remix";
import { Button } from "~/components/button";
import { getUserOrRedirect } from "~/features/auth/user.server";
import { getFollowingFeed } from "~/features/friends/feed.server";
import { getFollowers } from "~/features/friends/get.server";
import { FavoriteHeart, StarsDisplay } from "~/features/list/icons/icons";

export async function loader({ request }: LoaderFunctionArgs) {
  const response = new Response();
  const user = await getUserOrRedirect({ request, response });
  const [feed, followers] = await Promise.all([
    getFollowingFeed({ userId: user.id }),
    getFollowers({ userId: user.id }),
  ]);

  return json({ feed, followers: followers.length });
}

export default function FriendsIndex() {
  let data = useLoaderData<typeof loader>();

  return (
    <div>
      {data.feed.length ? (
        <ul className="flex flex-col gap-12">
          {data.feed.map(({ user, mediaItem, verb, ...review }, index) => {
            const name = user.firstName
              ? `${user.firstName}${user.lastName ? ` ${user.lastName}` : ""}`
              : user.username;

            return (
              <Link to={`/${user.username}/${review.id}`}>
                <li key={index} className="flex gap-5 items-start">
                  <Link
                    className="w-10 h-10 flex-shrink-0 rounded-full overflow-hidden"
                    to={"/" + user.username}
                  >
                    {user.avatar && (
                      <img className="w-full h-full" src={user.avatar} />
                    )}
                  </Link>

                  {mediaItem.coverArt && (
                    <img
                      className="object-contain h-auto w-16 rounded"
                      src={mediaItem.coverArt}
                    />
                  )}

                  <div className="px-3 text-sm">
                    <Link to={"/" + user.username}>
                      <span className="text-xs">{name}</span>{" "}
                    </Link>
                    <span className="text-xs">{verb}</span>
                    <div className="flex items-center gap-2">
                      <div className="flex flex-col justify-center">
                        <div className="flex gap-2 items-center">
                          <span className="text-lg font-bold">
                            {mediaItem.title}
                          </span>
                          {mediaItem.releaseDate && (
                            <span>({mediaItem.releaseDate})</span>
                          )}

                          {review.stars && (
                            <StarsDisplay stars={review.stars} />
                          )}
                          {review.favorited && <FavoriteHeart isOn />}
                        </div>
                        <span className="text-xs text-gray-500">
                          {mediaItem.creator}
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 leading-6 text-sm">
                      {review.review}
                    </div>
                  </div>
                </li>
              </Link>
            );
          })}
        </ul>
      ) : (
        <div className="mx-auto flex max-w-lg flex-col gap-4">
          <div className="flex flex-col items-center gap-5">
            <div className="text-center">
              <div className="flex gap-4 items-center justify-center">
                <h2 className="mt-2 text-base font-semibold leading-6 text-gray-900">
                  {data.followers === 0
                    ? "You haven't followed anyone yet!"
                    : "Your followers haven't added anything yet!"}
                </h2>
              </div>

              <p className="mt-1 text-sm text-gray-500">
                Start following others to see what they've been watching &
                reading!
              </p>
            </div>

            <Button type="button" className="px-6">
              <MagnifyingGlassIcon className="stroke-4 h-5 w-5" />
              <span className="ml-2">Find a user</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
