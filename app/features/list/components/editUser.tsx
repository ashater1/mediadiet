import { action } from "~/routes/__auth/user/update";
import { FolderPlusIcon, PencilIcon } from "@heroicons/react/24/outline";
import { Popover } from "@headlessui/react";
import { Spinner } from "~/components/login/Spinner";
import { useFetcher } from "@remix-run/react";
import { useRef, useState } from "react";
import { Button } from "~/components/button";
import classNames from "classnames";
import { CheckmarkIcon } from "react-hot-toast";

export function EditUser({
  first,
  last,
}: {
  first?: string | null;
  last?: string | null;
}) {
  const { data, Form, state } = useFetcher<typeof action>();
  const [file, setFile] = useState<boolean>(false);
  const ref = useRef<HTMLButtonElement>(null);

  if (data?.success && state === "idle") {
    ref.current?.click();
  }

  return (
    <Popover className="relative ml-3 flex">
      <Popover.Button
        as={Button}
        type="button"
        className="border border-transparent outline-none ring-0 active:scale-75"
      >
        <div className="relative ml-2 flex overflow-hidden px-1.5">
          <PencilIcon className="h-4 w-4 stroke-gray-200 stroke-1" />
        </div>
      </Popover.Button>

      <Popover.Panel className="absolute left-0 top-full z-50 mt-2 rounded-lg border border-white/10 bg-slate-400 bg-gray-900/75 p-4 text-sm text-white opacity-95 shadow-md backdrop-blur">
        <Form
          encType="multipart/form-data"
          method="post"
          action="/user/update"
          className="flex flex-col gap-2"
        >
          <div className="align-start flex flex-col">
            <label htmlFor="firstName" className="text-left text-white/70">
              First Name
            </label>
            <input
              defaultValue={first ?? ""}
              name="firstName"
              id="firstName"
              autoFocus
              className="mt-1 rounded border border-white/50 bg-transparent px-2 py-1 text-sm outline-none ring-0 focus:border-white/90"
            />
          </div>
          <div className="align-start flex flex-col">
            <label htmlFor="lastName" className="text-left text-white/70">
              Last Name
            </label>
            <input
              defaultValue={last ?? ""}
              name="lastName"
              id="lastName"
              className="mt-1 rounded border border-white/50 bg-transparent px-2 py-1 text-sm outline-none ring-0 focus:border-white/90"
            />
          </div>

          <label
            className={classNames(
              file && "bg-green-200 text-gray-800",
              "transition-color mt-2 flex w-full cursor-pointer items-center justify-center rounded border border-white/50 py-2 px-1 duration-500 focus:border-white/90"
            )}
            htmlFor="uploadImage"
          >
            <span className="whitespace-nowrap">Add/update photo</span>
            <div className="ml-2">
              {file ? (
                <CheckmarkIcon className="stroke-800 h-5 w-5 stroke-1" />
              ) : (
                <FolderPlusIcon className="h-5 w-5 stroke-white" />
              )}
            </div>
          </label>
          <input
            onChange={(e) => {
              setFile(!!e.target.files?.length);
            }}
            className="hidden"
            name="uploadImage"
            id="uploadImage"
            type="file"
          />

          <Button
            type="submit"
            className="mt-2 flex h-8 w-full items-center justify-center py-0.5 text-sm font-normal"
          >
            {state === "idle" ? "Save" : <Spinner diameter={4} />}
          </Button>

          <Popover.Button type="button" className="hidden" ref={ref} />
        </Form>
      </Popover.Panel>
    </Popover>
  );
}
