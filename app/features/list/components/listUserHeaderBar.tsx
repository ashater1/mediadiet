import {
  Form,
  useNavigation,
  useSearchParams,
  useSubmit,
} from "@remix-run/react";
import classNames from "classnames";
import { useSpinDelay } from "spin-delay";
import { FallbackAvatar } from "~/components/avatar";
import Spinner from "~/components/spinner";
import { useIsLoading } from "~/utils/useIsLoading";

export function UserHeaderBar({
  avatar,
  primaryText,
  secondaryText,
}: {
  avatar?: string;
  primaryText: string | null;
  secondaryText?: string;
}) {
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
        <h2 className="text-lg font-bold tracking-tight text-gray-900 md:text-xl">
          {primaryText ? primaryText : secondaryText}
        </h2>

        {primaryText && (
          <span className="text-sm text-gray-500">{secondaryText}</span>
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
        {counts.map((count, i) => (
          <div
            className={classNames(
              checkedTypes.length &&
                !checkedTypes.includes(
                  labels[i].searchParam ?? labels[i].label
                ) &&
                "opacity-40",
              "flex transition-opacity duration-200 ease-in-out first:pl-0 px-4"
            )}
          >
            <label
              htmlFor={labels[i].searchParam ?? labels[i].label}
              className="cursor-pointer"
            >
              <span className="text-lg font-semibold tracking-tight text-gray-900 md:text-xl">
                {count}
              </span>
              <span className="ml-2">{labels[i].label}</span>
            </label>

            <input
              hidden
              type="checkbox"
              name={paramName}
              id={labels[i].searchParam ?? labels[i].label}
              value={labels[i].searchParam ?? labels[i].label}
              defaultChecked={checkedTypes.includes(
                labels[i].searchParam ?? labels[i].label
              )}
            />
          </div>
        ))}
      </Form>
    </div>
  );
}
