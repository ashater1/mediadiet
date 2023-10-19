import { PlusIcon } from "@heroicons/react/24/outline";
import { useAddNewContext } from "~/features/add/context";
import { BookIcon, MovieIcon, TvShowIcon } from "../icons/icons";

type EmptyStateProps =
  | {
      isSelf: false;
      name: string;
    }
  | { isSelf: true; name?: string };

export function EmptyState({
  isSelf,
  name,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & EmptyStateProps) {
  const { openModal } = useAddNewContext();

  return (
    <div {...props} className="mx-auto flex max-w-lg flex-col gap-4">
      <div className="flex justify-center gap-6">
        <MovieIcon className="stroke-1 md:h-10 md:w-10" />
        <BookIcon className="stroke-1 md:h-10 md:w-10" />
        <TvShowIcon className="stroke-1 md:h-10 md:w-10" />
      </div>

      <div className="flex flex-col items-center gap-5">
        <div className="text-center">
          <h2 className="mt-2 text-base font-semibold leading-6 text-gray-900">
            {isSelf
              ? "You don't have anything in your list yet"
              : `${name} doesn't have anything on their list yet`}
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {isSelf
              ? "Start adding to your list so you can show others what you've been watching & reading, and start building your year-end list!"
              : "Check back later to see if they've starting adding things!"}
          </p>
        </div>

        {isSelf && (
          <button
            onClick={openModal}
            type="button"
            className="flex h-10 items-center justify-center rounded border px-3 text-sm font-medium text-gray-500 hover:bg-indigo-500 hover:text-gray-50"
          >
            <PlusIcon className="stroke-4 h-5 w-5" />
            <span className="ml-2">Start adding to your list</span>
          </button>
        )}
      </div>
    </div>
  );
}
