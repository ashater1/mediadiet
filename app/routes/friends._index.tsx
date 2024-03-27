import { useLoaderData } from "@remix-run/react";
import { LoaderFunctionArgs, json } from "@vercel/remix";
import { getUserOrRedirect } from "~/features/auth/user.server";
import { getFollowingFeed } from "~/features/friends/feed.server";
import { FavoriteHeart, StarsDisplay } from "~/features/list/icons/icons";

export async function loader({ request }: LoaderFunctionArgs) {
  const response = new Response();
  const user = await getUserOrRedirect({ request, response });
  const feed = await getFollowingFeed({ userId: user.id });
  return json(feed);
}

export default function FriendsIndex() {
  let data = useLoaderData<typeof loader>();

  return (
    <div>
      <ul className="flex flex-col gap-10">
        {data.map(({ user, mediaItem, verb, ...review }, index) => {
          const name = user.firstName
            ? `${user.firstName}${user.lastName ? ` ${user.lastName}` : ""}`
            : user.username;

          return (
            <li key={index} className="flex gap-5 items-start">
              {user.avatar && (
                <img className="w-10 h-10 rounded-full" src={user.avatar} />
              )}

              {mediaItem.coverArt && (
                <img
                  className="object-contain h-auto w-16 rounded"
                  src={mediaItem.coverArt}
                />
              )}

              <div className="text-xs">
                <span>{name}</span> <span>{verb}</span>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold">{mediaItem.title}</span>
                  <span>({mediaItem.releaseDate})</span>
                  {review.stars && <StarsDisplay stars={review.stars} />}
                  {review.favorited && <FavoriteHeart isOn />}
                </div>
                <div className="mt-2 leading-6 text-sm">{review.review}</div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
