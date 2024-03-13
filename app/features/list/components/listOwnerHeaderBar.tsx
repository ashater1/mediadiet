import {
  Form,
  useNavigation,
  useSearchParams,
  useSubmit,
} from "@remix-run/react";
import classNames from "classnames";
import { useSpinDelay } from "spin-delay";
import { FallbackAvatar } from "~/components/avatar";
import { Button } from "~/components/button";
import { CountsWithParams } from "~/components/headerbar/count";
import Spinner from "~/components/spinner";
import { useIsLoading } from "~/utils/useIsLoading";

type UserHeaderBarProps = {
  isSelf: boolean;
  avatar: string | null;
  primaryName: string | null;
  secondaryName: string;
};

export function UserHeaderBar({
  isSelf,
  avatar,
  primaryName,
  secondaryName,
}: UserHeaderBarProps) {
  return (
    <div className="relative flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
      <div className="hidden h-16 w-16 overflow-hidden rounded-full bg-gray-100 md:block">
        {avatar ? (
          <img className="h-full w-full" src={avatar} />
        ) : (
          <FallbackAvatar />
        )}
      </div>

      <div className="flex flex-col">
        <div className="flex items-center">
          <h2 className="text-lg font-bold tracking-tight text-gray-900 md:text-xl">
            {primaryName ? primaryName : secondaryName}
          </h2>

          {!isSelf && (
            <Button className="ml-3 font-normal text-sm h-auto py-1 px-3">
              Follow
            </Button>
          )}
        </div>

        {primaryName && (
          <span className="text-sm text-gray-500">{secondaryName}</span>
        )}
      </div>
    </div>
  );
}

export function ItemsCountAndFilter({
  paramName,
  counts,
  labels,
}: {
  paramName: string;
  counts: number[];
  labels: { label: string; searchParam?: string }[];
}) {
  const navigation = useNavigation();
  const submit = useSubmit();
  const [searchParams] = useSearchParams();
  const isLoading = useIsLoading({});
  const showSpinner = useSpinDelay(isLoading, {
    delay: 100,
    minDuration: 650,
  });

  if (counts.length !== labels.length) {
    throw new Error("counts and labels must be the same length");
  }

  const checkedTypes =
    navigation.formData?.getAll(paramName) ?? searchParams.getAll(paramName);

  return (
    <div className="relative md:ml-auto self-auto md:self-end w-min">
      {showSpinner && (
        <div className="absolute right-0 translate-x-full">
          <Spinner className="mr-4 w-6 h-6" />
        </div>
      )}

      <Form
        onChange={(e) => {
          submit(e.currentTarget);
        }}
        className="relative flex  divide-x divide-slate-300 md:ml-auto self-auto md:self-end"
      >
        <CountsWithParams
          count={counts[0]}
          label="movies"
          active={checkedTypes.includes("movie")}
          defaultChecked={checkedTypes.includes("movie")}
          name="type"
          value="movie"
        />

        <CountsWithParams
          active={checkedTypes.includes("book")}
          defaultChecked={checkedTypes.includes("book")}
          count={counts[1]}
          label="books"
          name="type"
          value="book"
        />

        <CountsWithParams
          active={checkedTypes.includes("tv")}
          defaultChecked={checkedTypes.includes("tv")}
          count={counts[2]}
          label="seasons"
          name="type"
          value="tv"
        />

        {/* {counts.map((count, i) => {
          console.log(labels[i].searchParam ?? labels[i].label);

          return (
            <CountsWithParams
              count={count}
              label={labels[i].label}
              active={checkedTypes.includes(
                labels[i].searchParam ?? labels[i].label
              )}
              name="type"
              value="book"
            />
          );
        })} */}
      </Form>
    </div>
  );
}
