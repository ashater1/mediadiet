import * as ToggleGroup from "@radix-ui/react-toggle-group";
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
      className="relative -ml-px inline-flex w-full flex-1 items-center justify-center bg-transparent px-3 py-2 text-sm text-gray-900  border border-primary-800/20 first:ml-0 first:rounded-l-md ring-inset last:rounded-r-md hover:bg-primary-800/10 focus:z-10 active:bg-primary-800/20 data-[state=on]:ring-4 data-[state=on]:ring-primary-800/30"
      value={value}
    >
      {children}
    </ToggleGroup.Item>
  );
}
