import {
  Form,
  useNavigation,
  useSearchParams,
  useSubmit,
} from "@remix-run/react";
import classNames from "classnames";

export default function ListUserHeaderBar({
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
      className="flex divide-x divide-slate-300 md:ml-auto"
    >
      <div
        className={classNames(
          checkedMediaTypes.length &&
            !checkedMediaTypes.includes("movie") &&
            "opacity-40",
          "flex items-baseline gap-x-2 transition-opacity duration-200 ease-in-out"
        )}
      >
        <label htmlFor="movie" className="cursor-pointer px-4">
          <span className="text-lg font-semibold tracking-tight text-gray-900 md:text-3xl">
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
          <span className="text-lg font-semibold tracking-tight text-gray-900 md:text-3xl">
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
          <span className="text-lg font-semibold tracking-tight text-gray-900 md:text-3xl">
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
