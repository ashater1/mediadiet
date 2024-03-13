import {
  Form,
  useNavigation,
  useSearchParams,
  useSubmit,
} from "@remix-run/react";
import classNames from "classnames";
import { useSpinDelay } from "spin-delay";
import Spinner from "~/components/spinner";
import { useIsLoading } from "~/utils/useIsLoading";

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
