import { PlusIcon } from "@heroicons/react/20/solid";
import { useParams } from "@remix-run/react";
import classNames from "classnames";
import { Button } from "~/components/button";
import { useAddNewContext } from "~/features/add/context";

export default function EmptyList({ isSelf }: { isSelf?: boolean }) {
  const params = useParams();
  const addNew = useAddNewContext();

  return (
    <div className="flex gap-6 text-center">
      <img
        src="https://i.gifer.com/7VE.gif"
        alt="your list is empty!"
        className="hidden h-40 w-auto lg:block"
      />
      <div className="mt-2">
        <EmptyListTitle>
          {`Looks like ${
            isSelf ? "you haven't" : `@${params.username} hasn't`
          } added anything yet`}
        </EmptyListTitle>

        {isSelf ? (
          <>
            <EmptyListDescription className="mt-1">
              Get started by adding something to your list!
            </EmptyListDescription>

            <div className="mt-6 flex justify-center">
              <Button
                onClick={() => addNew?.openModal()}
                className="flex items-center justify-center gap-2"
              >
                <PlusIcon
                  className="-ml-0.5 mr-1.5 h-5 w-5"
                  aria-hidden="true"
                />
                Add to your list
              </Button>
            </div>
          </>
        ) : (
          <EmptyListDescription className="mt-1">
            Check back later to see if they've added to their list!
          </EmptyListDescription>
        )}
      </div>
      <img
        src="https://i.gifer.com/7VE.gif"
        alt="your list is empty!"
        className="hidden h-40 w-auto lg:block"
      />
    </div>
  );
}

export function EmptyListTitle({
  className,
  children,
  ...props
}: React.ComponentProps<"h3">) {
  return (
    <h3
      {...props}
      className={classNames(
        "whitespace-normal font-semibold text-gray-200",
        className && className
      )}
    >
      {children}
    </h3>
  );
}

export function EmptyListDescription({
  className,
  children,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      {...props}
      className={classNames(
        "mt-1 text-base text-gray-400",
        className && className
      )}
    >
      {children}
    </p>
  );
}
