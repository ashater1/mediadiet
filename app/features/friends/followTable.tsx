import { FallbackAvatar } from "~/components/avatar";
import { type getFollowing } from "./get.server";
import { Link } from "@remix-run/react";

type FriendsListProps = Awaited<ReturnType<typeof getFollowing>>[0];

export function FriendsTable({ followers }: { followers: FriendsListProps[] }) {
  return (
    <table>
      <thead>
        <tr>
          <th className="w-full text-left">Name</th>
          <th className="text-left">Movies</th>
          <th className="text-left">Books</th>
          <th className="text-left">Seasons</th>
        </tr>
      </thead>
      <tbody>
        {followers.map((f) => {
          return <FriendsTableRow {...f} />;
        })}
      </tbody>
    </table>
  );
}

export function FriendsTableRow({
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
    <tr>
      <td className="py-5">
        <Link to={`/${username}`} prefetch="intent">
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full overflow-hidden">
              {avatar ? (
                <img className="w-full h-full" src={avatar} alt={username} />
              ) : (
                <FallbackAvatar />
              )}
            </div>
            <div className="flex flex-col">
              <span className="whitespace-nowrap text-base">{displayName}</span>
              <span className="text-xs text-gray-500 whitespace-nowrap">{`Joined ${created_date}`}</span>
            </div>
          </div>
        </Link>
      </td>
      <td>
        <Link to={`/${username}?type=movie`} prefetch="intent">
          <div className="mr-6">
            <span className="text-lg font-bold">{movie_count}</span>
            <span className="ml-1.5 text-sm">movies</span>
          </div>
        </Link>
      </td>
      <td>
        <Link to={`/${username}?type=book`} prefetch="intent">
          <div className="mr-6">
            <span className="text-lg font-bold">{book_count}</span>
            <span className="ml-1.5 text-sm">books</span>
          </div>
        </Link>
      </td>
      <td>
        <Link to={`/${username}?type=tv`} prefetch="intent">
          <div>
            <span className="text-lg font-bold">{tv_count}</span>
            <span className="ml-1.5 text-sm">seasons</span>
          </div>
        </Link>
      </td>
    </tr>
  );
}
