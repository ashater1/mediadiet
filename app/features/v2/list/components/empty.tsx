import { PlusIcon } from "@heroicons/react/24/outline";
import { Button } from "~/components/button";
import { useAddNewContext } from "~/features/add/context";
import { useListOwnerContext } from "~/features/v2/list/hooks/useListOwnerContext";

export function EmptyState({ ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { openModal } = useAddNewContext();
  const { listOwner, isSelf } = useListOwnerContext();

  return (
    <div {...props} className="mx-auto flex max-w-lg flex-col gap-4">
      <div className="flex flex-col items-center gap-5">
        <div className="text-center">
          <div className="flex gap-4 items-center justify-center">
            <h2 className="mt-2 text-base font-semibold leading-6 text-gray-900">
              {isSelf
                ? "You don't have anything in your list yet"
                : `${
                    listOwner.firstName ?? listOwner.username
                  } doesn't have anything on their list yet`}
            </h2>
          </div>

          <p className="mt-1 text-sm text-gray-500">
            {isSelf
              ? "Start adding to your list so you can show others what you've been watching & reading!"
              : "Check back later to see if they've starting adding things!"}
          </p>
        </div>

        {isSelf && (
          <Button type="button" onClick={openModal} className="px-6">
            <PlusIcon className="stroke-4 h-5 w-5" />
            <span className="ml-2">Start adding to your list</span>
          </Button>
        )}
      </div>
    </div>
  );
}
