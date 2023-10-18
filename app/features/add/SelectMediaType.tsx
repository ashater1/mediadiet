import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { useAddNewContext } from "./context";
import { MovieIcon, BookIcon, TvShowIcon } from "../list/icons/icons";
import { MediaType } from "../list/types";

type SelectMediaOptionsType = {
  name: string;
  value: MediaType;
  Icon: any;
};

const selectMediaOptions: SelectMediaOptionsType[] = [
  {
    name: "Movie",
    value: "movie",
    Icon: MovieIcon,
  },
  {
    name: "Book",
    value: "book",
    Icon: BookIcon,
  },
  {
    name: "Tv",
    value: "tv",
    Icon: TvShowIcon,
  },
];

export function SelectMediaType({
  mediaType,
  onChange,
}: {
  mediaType: MediaType;
  onChange: (value: MediaType) => void;
}) {
  return (
    <ToggleGroup.Root
      type="single"
      className="flex w-full rounded rounded-l"
      onValueChange={(value: MediaType) => value && onChange(value)}
      value={mediaType}
    >
      {selectMediaOptions.map(({ value, name, Icon }, index) => (
        <SelectMediaTypeButton key={index} value={value}>
          <div className="flex items-center justify-center gap-2">
            <Icon className="stroke-black stroke-[1px]" />
            <span>{name}</span>
          </div>
        </SelectMediaTypeButton>
      ))}
    </ToggleGroup.Root>
  );
}

function SelectMediaTypeButton({
  value,
  children,
}: {
  value: string;
  children: React.ReactNode;
}) {
  return (
    <ToggleGroup.Item
      // className="flex-1 border border-r border-r-gray-100 py-2 text-sm text-gray-900 outline-none ring-1 ring-inset ring-gray-300 last:border-none hover:bg-gray-50 active:bg-gray-100 data-[state=on]:bg-gray-50"
      className="relative -ml-px inline-flex w-full flex-1 items-center justify-center bg-white px-3 py-2 text-sm text-gray-900 ring-1 ring-inset ring-gray-300 first:ml-0 first:rounded-l-md last:rounded-r-md hover:bg-gray-50 focus:z-10 active:bg-gray-100 data-[state=on]:bg-gray-50"
      value={value}
    >
      {children}
    </ToggleGroup.Item>
  );
}
