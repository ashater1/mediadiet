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
          <th className="md:px-7 px-2 text-center">Movies</th>
          <th className="md:px-7 px-2 text-left">Books</th>
          <th className="md:px-7 px-2 text-left">Seasons</th>
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
            <div className="hidden md:block w-10 h-10 rounded-full overflow-hidden">
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
          <div className="w-full mr-6 text-center">
            <span className="text-lg font-bold">{movie_count}</span>{" "}
            <span className="hidden md:inline-block text-sm">
              {movie_count === 1 ? "movie" : "movies"}
            </span>
          </div>
        </Link>
      </td>
      <td>
        <Link to={`/${username}?type=book`} prefetch="intent">
          <div className="w-full mr-6 text-center">
            <span className="text-lg font-bold">{book_count}</span>{" "}
            <span className="hidden md:inline-block text-sm">
              {book_count === 1 ? "book" : "books"}
            </span>
          </div>
        </Link>
      </td>
      <td>
        <Link to={`/${username}?type=tv`} prefetch="intent">
          <div className="w-full ml-1.5 text-center">
            <span className="text-lg font-bold">{tv_count}</span>{" "}
            <span className="hidden md:inline-block text-sm">
              {tv_count === 1 ? "season" : "seasons"}
            </span>
          </div>
        </Link>
      </td>
    </tr>
  );
}
