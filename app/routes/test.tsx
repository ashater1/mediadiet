import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useLoaderData } from "@remix-run/react";
import { LoaderFunctionArgs } from "@vercel/remix";
import { set } from "lodash";
import { useState } from "react";
import { Combobox } from "~/components/combobox";
import { PageFrame } from "~/components/frames";
import { Spinner } from "~/components/login/Spinner";
import { getUserOrRedirect } from "~/features/auth/user.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const response = new Response();
  const user = await getUserOrRedirect({ request, response });

  return null;
}

let original = ["adam", "joe", "alex", "kelly", "chris"];

export default function Test() {
  const data = useLoaderData<typeof loader>();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredItems, setFilteredItems] = useState<string[]>(original);
  const onSelect = (v: string) => console.log(v);

  const onInputChange = (v: string) => {
    console.log({ v });

    setSearchTerm(v);
    v
      ? setFilteredItems(original.filter((item) => item.includes(v)))
      : setFilteredItems(original);
    console.log(filteredItems);
  };

  return (
    <PageFrame>
      <Combobox.Root
        searchTerm={searchTerm}
        onInputChange={onInputChange}
        items={filteredItems}
        onSelect={onSelect}
      >
        {({ isOpen, highlightedIndex, filteredItems }) => (
          <div className="relative w-full">
            <div className="flex flex-col gap-1">
              <Combobox.Label className="sr-only w-fit">Search</Combobox.Label>

              <div className="relative rounded border border-slate-200">
                <MagnifyingGlassIcon
                  className="pointer-events-none absolute left-2 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
                  aria-hidden="true"
                />
                <Combobox.Input
                  placeholder={"Search for a user"}
                  className="z-50 w-full rounded border border-primary-800/50 p-1.5 pl-10 text-gray-800 outline-none focus:ring-0"
                />
              </div>
            </div>

            <Combobox.Items className="absolute z-50 mt-2 max-h-60 w-full divide-y divide-white/10 overflow-y-auto rounded border border-gray-200 bg-white p-0 text-gray-900 shadow-xl empty:hidden">
              {filteredItems.map((item, index) => (
                <Combobox.Item item={item} index={index}>
                  <div className="flex w-full flex-col justify-center">
                    <div className="flex w-full items-center justify-center">
                      <span className="truncate">{item}</span>
                    </div>
                  </div>
                </Combobox.Item>
              ))}
            </Combobox.Items>
          </div>
        )}
      </Combobox.Root>
    </PageFrame>
  );
}
