import { listToString } from "~/utils/funcs";

type MyListEntryArgs = {
  title: string;
  creators: string[];
  releaseYear: string | null;
};

export function MyListEntry({ title, creators, releaseYear }: MyListEntryArgs) {
  return (
    <>
      <div className="flex w-52 flex-col gap-1 overflow-hidden md:w-full">
        <p className="overflow-hidden truncate text-sm font-semibold text-gray-200 md:text-base">
          {title}
        </p>

        <div className="flex items-center gap-2">
          <p className="truncate text-xs text-gray-400 md:text-sm">
            {listToString(creators)}
          </p>

          {!!creators.length && releaseYear && (
            <svg viewBox="0 0 2 2" className="h-[3px] w-[3px] fill-gray-400">
              <circle cx={1} cy={1} r={1} />
            </svg>
          )}

          {releaseYear && (
            <p className="truncate text-xs text-gray-400 md:text-sm">
              {releaseYear}
            </p>
          )}
        </div>
      </div>
    </>
  );
}
