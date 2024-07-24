import { Link } from "@remix-run/react";
import { getFollowing } from "./get.server";
import { FallbackAvatar } from "~/components/avatar";

type FriendsListProps = Awaited<ReturnType<typeof getFollowing>>[0];

export function Friend({
  avatar,
  username,
  created_date,
  movie_count,
  book_count,
  tv_count,
  first_name,
  last_name,
}: FriendsListProps) {
  const displayName = first_name
    ? `${first_name}${last_name ? ` ${last_name}` : ""} `
    : `@${username}`;

  return (
    <>
      <div className="w-10 h-10 rounded-full overflow-hidden">
        {avatar ? (
          <img className="w-full h-full" src={avatar} alt={username} />
        ) : (
          <FallbackAvatar />
        )}
      </div>

      <div className="flex-col flex">
        <span className="whitespace-nowrap text-base">{displayName}</span>
        <span className="text-xs text-gray-500 whitespace-nowrap">{`Joined ${created_date}`}</span>
      </div>

      <Link prefetch="intent" to={`/${username}?type=movie`} className="pr-4">
        <span className="font-bold text-base md:text-lg mr-1.5">
          {movie_count}
        </span>
        movies
      </Link>

      <Link prefetch="intent" to={`/${username}?type=book`} className="px-4">
        <span className="font-bold text-base md:text-lg mr-1.5">
          {book_count}
        </span>
        books
      </Link>

      <Link prefetch="intent" to={`/${username}?type=tv`} className="px-4">
        <span className="font-bold md:text-large text-base mr-1.5">
          {tv_count}
        </span>
        seasons
      </Link>
    </>
  );
  // return (
  //   <li className="flex-col md:flex-row gap-1 md:gap-3 flex md:items-end">
  //     <Link to={`/${username}`} className="flex items-center gap-3">
  //       {avatar && (
  //         <img className="w-10 h-10 rounded-full" src={avatar} alt={username} />
  //       )}
  //       <div className="flex-col flex">
  //         <span className="whitespace-nowrap text-base">{displayName}</span>
  //         <span className="text-xs text-gray-500 whitespace-nowrap">{`Joined ${created_date}`}</span>
  //       </div>
  //     </Link>

  //     <div className="ml-[50px] md:ml-10 flex divide-x divide-slate-300">
  //       <Link prefetch="intent" to={`/${username}?type=movie`} className="pr-4">
  //         <span className="font-bold text-base md:text-lg mr-1.5">
  //           {movie_count}
  //         </span>
  //         movies
  //       </Link>
  //       <Link prefetch="intent" to={`/${username}?type=book`} className="px-4">
  //         <span className="font-bold text-base md:text-lg mr-1.5">
  //           {book_count}
  //         </span>
  //         books
  //       </Link>
  //       <Link prefetch="intent" to={`/${username}?type=tv`} className="px-4">
  //         <span className="font-bold md:text-large text-base mr-1.5">
  //           {tv_count}
  //         </span>
  //         seasons
  //       </Link>
  //     </div>
  //   </li>
  // );
}
