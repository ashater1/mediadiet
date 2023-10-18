import { TrashIcon } from "@heroicons/react/24/outline";
import { useFetcher } from "@remix-run/react";
import { Spinner } from "~/components/login/Spinner";
import { MediaType } from "../types";

export function DeleteButton({
  isBeingDeleted,
  id,
  mediaType,
}: {
  isBeingDeleted?: boolean;
  id: string;
  mediaType: MediaType;
}) {
  const { submit } = useFetcher();

  const deleteEntry = async ({
    id,
    mediaType,
  }: {
    id: string;
    mediaType: MediaType;
  }) => {
    submit({ id }, { action: `/list/${mediaType}/delete`, method: "post" });
  };

  return (
    <button
      onClick={() =>
        deleteEntry({
          id,
          mediaType,
        })
      }
      className="flex items-center justify-center rounded-md bg-black bg-opacity-20 p-1.5 text-sm font-medium text-white transition-all duration-200 hover:bg-opacity-30 md:px-4 md:py-2  md:opacity-0 md:group-hover:opacity-100"
    >
      <span className="sr-only">Delete</span>

      {isBeingDeleted ? (
        <Spinner diameter={5} />
      ) : (
        <TrashIcon className="h-4 w-4 fill-gray-300 stroke-gray-600 md:h-6 md:w-6" />
      )}
    </button>
  );
}
