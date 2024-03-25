import {
  UseComboboxState,
  UseComboboxStateChangeOptions,
  useCombobox,
} from "downshift";
import { Combobox } from "~/components/combobox";
import { Spinner } from "~/components/login/Spinner";
import classNames from "classnames";
import { useAddNewContext } from "../../add/context";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { MediaType } from "@prisma/client";

export type ComboboxOption = {
  id: string;
  title: string;
  creators?: string;
  releaseYear?: string | null;
};

export const stateReducer = (
  state: UseComboboxState<any>,
  actionAndChanges: UseComboboxStateChangeOptions<any>
) => {
  const { type, changes } = actionAndChanges;

  switch (type) {
    case useCombobox.stateChangeTypes.ItemClick:
    case useCombobox.stateChangeTypes.InputKeyDownEnter:
      return {
        ...changes,
        inputValue: state.inputValue,
      };

    default:
      return changes;
  }
};

export function SearchCombobox({
  searchTerm,
  onInputChange,
  items,
  onSelect,
  isSearchLoading,
  selectedItem,
  mediaType,
}: {
  searchTerm: string;
  onInputChange: (value: string) => void;
  items: ReturnType<typeof useAddNewContext>["searchData"];
  onSelect: (item: any) => void;
  isSearchLoading: boolean;
  selectedItem: string | null;
  mediaType: MediaType;
}) {
  // const { searchData, isSearchLoading, state, setSearchTerm, setSelectedItem } =
  //   useAddNewContext();

  return (
    <Combobox.Root
      searchTerm={searchTerm}
      onInputChange={onInputChange}
      items={items?.data ?? []}
      stateReducer={stateReducer}
      onSelect={(item) => onSelect(item)}
    >
      {({ isOpen, highlightedIndex }) => (
        <div className="relative w-full">
          <div className="flex flex-col gap-1">
            <Combobox.Label className="sr-only w-fit">Search</Combobox.Label>

            <div className="relative rounded border border-slate-200">
              <MagnifyingGlassIcon
                className="pointer-events-none absolute left-2 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
                aria-hidden="true"
              />
              <Combobox.Input
                placeholder={
                  mediaType === "TV"
                    ? "Search for a show"
                    : mediaType
                    ? `Search for a ${mediaType.toLowerCase()}`
                    : "Choose a type"
                }
                className="z-50 w-full rounded border border-primary-800/50 p-1.5 pl-10 text-gray-800 outline-none focus:ring-0"
              />
            </div>
          </div>

          <Combobox.Items className="absolute z-50 mt-2 max-h-60 w-full divide-y divide-white/10 overflow-y-auto rounded border border-gray-200 bg-white p-0 text-gray-900 shadow-xl empty:hidden">
            {!searchTerm.trim().length ? null : isSearchLoading ? (
              <div className="flex w-full items-center justify-center py-4 px-3 shadow-sm">
                <Spinner diameter={6} />
              </div>
            ) : (
              items?.data.map((item, index) => (
                <SearchComboboxItem
                  key={index}
                  className={classNames(
                    highlightedIndex === index && "font-extrabold",
                    selectedItem === item.id && "animate-pulse font-extrabold",
                    "flex w-full items-center gap-2 py-2 px-3"
                  )}
                  index={index}
                  item={item}
                />
              ))
            )}
          </Combobox.Items>
        </div>
      )}
    </Combobox.Root>
  );
}

function SearchComboboxItem({
  className,
  item,
  index,
}: {
  className: string;
  item: any;
  index: number;
}) {
  return (
    <Combobox.Item className={className} item={item} index={index}>
      <div className="flex w-full flex-col justify-center">
        <div className="flex w-full items-center justify-center">
          <span className="truncate">{item.title}</span>
          <span className="flex-0 ml-auto text-xs opacity-60">
            {item.releaseYear}
          </span>
        </div>
        <span className="w-full truncate text-left text-xs opacity-60">
          {item.creators}
        </span>
      </div>
    </Combobox.Item>
  );
}

// combobox is empty
// combobox is loading
// combobox has results
