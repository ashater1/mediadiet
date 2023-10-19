import {
  Form,
  useNavigation,
  useSearchParams,
  useSubmit,
} from "@remix-run/react";
import classNames from "classnames";
import { FallbackAvatar } from "~/components/avatar";

export function UserHeaderBar({
  avatar,
  firstName,
  lastName,
  username,
  moiveCount,
  bookCount,
  tvCount,
}: {
  avatar?: string;
  firstName?: string | null;
  lastName?: string | null;
  username: string;
  moiveCount: number;
  bookCount: number;
  tvCount: number;
}) {
  return (
    <div className="relative flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
      <div className="hidden h-16 w-16 overflow-hidden rounded-full bg-gray-100 md:block">
        {avatar ? (
          <img className="h-full w-full" src={avatar} />
        ) : (
          <FallbackAvatar />
        )}
      </div>

      <div className="flex flex-col">
        <h2 className="text-lg font-bold tracking-tight text-gray-900 md:text-xl">
          {firstName ? firstName + " " + lastName : `${username}`}
        </h2>

        {firstName && (
          <span className="text-sm text-gray-500">@ {username}</span>
        )}
      </div>

      <UserItemsCountAndFilter
        movieCount={moiveCount}
        bookCount={bookCount}
        tvCount={tvCount}
      />
    </div>
  );
}

export function UserItemsCountAndFilter({
  movieCount,
  bookCount,
  tvCount,
  labels = ["movies", "books", "seasons"],
}: {
  movieCount: number;
  bookCount: number;
  tvCount: number;
  labels?: [string, string, string];
}) {
  const navigation = useNavigation();
  const submit = useSubmit();
  const [searchParams] = useSearchParams();

  const checkedMediaTypes =
    navigation.formData?.getAll("type") ?? searchParams.getAll("type");

  return (
    <Form
      onChange={(e) => submit(e.currentTarget)}
      className="flex divide-x divide-slate-300 md:ml-auto self-auto md:self-end"
    >
      <div
        className={classNames(
          checkedMediaTypes.length &&
            !checkedMediaTypes.includes("movie") &&
            "opacity-40",
          "flex items-baseline gap-x-2 transition-opacity duration-200 ease-in-out"
        )}
      >
        <label htmlFor="movie" className="cursor-pointer pr-4">
          <span className="text-lg font-semibold tracking-tight text-gray-900 md:text-xl">
            {movieCount}
          </span>
          <span className="ml-2">{labels[0]}</span>
        </label>

        <input
          hidden
          type="checkbox"
          name="type"
          id="movie"
          value="movie"
          defaultChecked={checkedMediaTypes.includes("movie")}
        />
      </div>

      <div
        className={classNames(
          checkedMediaTypes.length &&
            !checkedMediaTypes.includes("book") &&
            "opacity-40",
          "flex items-baseline gap-x-2 transition-opacity duration-200 ease-in-out"
        )}
      >
        <label htmlFor="book" className="cursor-pointer px-4">
          <span className="text-lg font-semibold tracking-tight text-gray-900 md:text-xl">
            {bookCount}
          </span>
          <span className="ml-2">{labels[1]}</span>
        </label>
        <input
          hidden
          type="checkbox"
          name="type"
          id="book"
          value="book"
          defaultChecked={checkedMediaTypes.includes("book")}
        />
      </div>

      <div
        className={classNames(
          checkedMediaTypes.length &&
            !checkedMediaTypes.includes("tv") &&
            "opacity-40",
          "flex items-baseline gap-x-2 transition-opacity duration-200 ease-in-out"
        )}
      >
        <label htmlFor="tv" className="cursor-pointer px-4">
          <span className="text-lg font-semibold tracking-tight text-gray-900 md:text-xl">
            {tvCount}
          </span>
          <span className="ml-2">{labels[2]}</span>
        </label>
        <input
          hidden
          type="checkbox"
          name="type"
          id="tv"
          value="tv"
          defaultChecked={checkedMediaTypes.includes("tv")}
        />
      </div>
    </Form>
  );
}
