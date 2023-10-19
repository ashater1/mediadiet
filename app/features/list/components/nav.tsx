import { Listbox, Popover } from "@headlessui/react";
import {
  BookOpenIcon,
  ChevronUpDownIcon,
  FilmIcon,
  HandThumbDownIcon,
  HandThumbUpIcon,
  ListBulletIcon,
  NewspaperIcon,
  StarIcon,
  TrashIcon,
  TvIcon,
} from "@heroicons/react/24/outline";
import {
  Form,
  NavLink,
  useLocation,
  useSearchParams,
  useSubmit,
  useNavigation,
} from "@remix-run/react";
import {
  useListNav,
  Action as NavAction,
  State as NavState,
  OneOfArray,
} from "~/features/list/components/useListNav";
import classNames from "classnames";
import { Dispatch, useEffect, useMemo, useState } from "react";
import { useSpinDelay } from "spin-delay";
import capitalize from "lodash/capitalize";
import { listToString } from "~/utils/supabase";

type SortOptions = (typeof sortOptions)[number];

const sortOptions = [
  {
    desc: "Newest",
    param: "desc",
  },
  {
    desc: "Oldest",
    param: "asc",
  },
] as const;

function ButtonCheckbox({
  children,
  id,
  name,
  value,
}: {
  children:
    | React.ReactNode
    | (({ isChecked }: { isChecked: boolean }) => React.ReactNode);
  id: string;
  name: string;
  value: string;
}) {
  // const [isChecked, setChecked] = useState();
  const [searchParams] = useSearchParams();

  const [isChecked, setChecked] = useState(
    searchParams.getAll(name).includes(value)
  );

  return (
    <>
      <button onClick={() => setChecked(!isChecked)}>
        {typeof children !== "function" ? children : children({ isChecked })}
      </button>
      <input
        checked={isChecked}
        hidden
        id={id}
        name={name}
        value={value}
        type="checkbox"
      />
    </>
  );
}

function Sort({
  dispatch,
  getIsActive,
}: {
  getIsActive: <K extends keyof NavState, V extends OneOfArray<NavState[K]>>(
    key: K,
    value: V
  ) => boolean | null;
  dispatch: Dispatch<NavAction>;
}) {
  const [searchParams] = useSearchParams();

  const onChange = (value: SortOptions["param"]) => {
    dispatch({ type: "sort", payload: value });
  };

  return (
    <Listbox onChange={onChange}>
      <div className="relative text-sm">
        <Listbox.Button className="flex items-center gap-1 rounded-md border border-gray-300 bg-gray-100 px-2 py-1">
          <span className="font-bold">{`Sort by: `}</span>
          <span className="w-12">
            {getIsActive("sort", "asc") ? "Oldest" : "Newest"}
          </span>
          <ChevronUpDownIcon
            className="h-6 w-6 text-gray-700"
            aria-hidden="true"
          />
        </Listbox.Button>
        <Listbox.Options className="absolute right-0 z-10 mt-2 w-64 rounded-md border bg-white">
          <h3 className="border-b border-b-gray-200 px-4 py-2 font-bold">
            Sort by:
          </h3>
          {sortOptions.map((sortOption, i) => {
            const active = getIsActive("sort", sortOption.param);
            const activeSort =
              sortOption.param === "desc"
                ? active || active === null
                : active === true;

            return (
              <Listbox.Option
                className={({ active: focused }) =>
                  classNames(
                    focused && !active && "cursor-pointer bg-red-300",
                    activeSort && "text-gray-400",
                    "whitespace-nowrap border-b border-b-gray-200 px-4 py-2 last:rounded-b-md"
                  )
                }
                disabled={activeSort}
                key={i}
                value={sortOption.param}
              >
                {sortOption.desc}
              </Listbox.Option>
            );
          })}
        </Listbox.Options>
      </div>
    </Listbox>
  );
}

function Filter({
  active,
  dispatch,
  getIsActive,
}: {
  active: Array<keyof Omit<NavState, "sort">>;
  getIsActive: <K extends keyof NavState, V extends OneOfArray<NavState[K]>>(
    key: K,
    value: V
  ) => boolean | null;
  dispatch: Dispatch<NavAction>;
}) {
  const [searchParams] = useSearchParams();

  return (
    <Popover>
      <div className="relative text-sm">
        <Popover.Button className="flex items-center gap-1 rounded-md border border-gray-300 bg-gray-100 px-2 py-1">
          <span className="px-2 font-bold">
            {active.length
              ? `Filtering by ${
                  active.length > 2
                    ? `${active.length} fields`
                    : listToString(active.map((a) => capitalize(a)))
                }`
              : "Filter"}
          </span>

          <ChevronUpDownIcon
            className="h-6 w-6 text-gray-700"
            aria-hidden="true"
          />
        </Popover.Button>
        <Popover.Panel className="absolute right-0 z-10 mt-2 w-64 rounded-md border bg-white">
          <div className="flex items-center border-b border-b-gray-200 py-2 ">
            <h3 className="px-4 py-2 font-bold">Filter by:</h3>
            <button
              type="button"
              onClick={() => dispatch({ type: "reset" })}
              className={classNames(
                active.length
                  ? "cursor-pointer hover:bg-gray-300"
                  : "cursor-default opacity-30",
                "ml-auto mr-2 flex items-center rounded-full p-2 "
              )}
            >
              <TrashIcon className="h-5 w-5 fill-slate-200 stroke-1" />
              {/* <span className="text-xs">Clear</span> */}
            </button>
          </div>
          <ul>
            <li className="flex items-center border-b border-b-gray-200 px-4 py-3 last:rounded-b-md">
              <div>Type</div>
              <div className="ml-auto flex gap-3">
                <button
                  type="button"
                  className={classNames(
                    getIsActive("type", "movie")
                      ? "border border-green-600 bg-green-100"
                      : "border border-transparent",
                    "rounded p-1"
                  )}
                  onClick={() => dispatch({ type: "type", payload: "movie" })}
                >
                  <FilmIcon className="stroke-1.5 h-6 fill-white" />
                </button>
                <button
                  type="button"
                  className={classNames(
                    getIsActive("type", "book")
                      ? "border border-green-600 bg-green-100"
                      : "border border-transparent",
                    "rounded p-1"
                  )}
                  onClick={() => dispatch({ type: "type", payload: "book" })}
                >
                  <BookOpenIcon className="stroke-1.5 h-6 fill-white" />
                </button>
                <button
                  type="button"
                  className={classNames(
                    getIsActive("type", "tv")
                      ? "border border-green-600 bg-green-100"
                      : "border border-transparent",
                    "rounded p-1"
                  )}
                  onClick={() => dispatch({ type: "type", payload: "tv" })}
                >
                  <TvIcon className="stroke-1.5 h-6 fill-white" />
                </button>
              </div>
            </li>
            <li className="flex items-center whitespace-nowrap border-b border-b-gray-200 px-4 py-3 last:rounded-b-md">
              <div>Rating</div>
              <div className="ml-auto flex gap-3">
                <button
                  type="button"
                  className={classNames(
                    getIsActive("rating", null)
                      ? "border border-green-600 bg-green-100"
                      : "border border-transparent",
                    "rounded px-1.5"
                  )}
                  onClick={() => dispatch({ type: "rating", payload: null })}
                >
                  <div className="align-center rounded border border-gray-400 bg-white px-2 text-center text-xs">
                    None
                  </div>
                </button>

                <button
                  type="button"
                  className={classNames(
                    getIsActive("rating", "disliked")
                      ? "border border-green-600 bg-green-100"
                      : "border border-transparent",
                    "rounded p-1"
                  )}
                  onClick={() =>
                    dispatch({ type: "rating", payload: "disliked" })
                  }
                >
                  <HandThumbDownIcon className="stroke-1.5 h-6 scale-x-flip fill-white" />
                </button>
                <button
                  className={classNames(
                    getIsActive("rating", "liked")
                      ? "border border-green-600 bg-green-100"
                      : "border border-transparent",
                    "rounded p-1"
                  )}
                  onClick={() => dispatch({ type: "rating", payload: "liked" })}
                >
                  <HandThumbUpIcon className="stroke-1.5 h-6 fill-white" />
                </button>
              </div>
            </li>
            <li className="flex items-center whitespace-nowrap border-b border-b-gray-200 px-4 py-2 last:rounded-b-md">
              <div>Favorited</div>
              <div className="ml-auto flex items-center gap-3">
                <button
                  type="button"
                  className={classNames(
                    getIsActive("favorited", false)
                      ? "border border-green-600 bg-green-100"
                      : "border border-transparent",
                    "rounded p-1"
                  )}
                  onClick={() =>
                    dispatch({ type: "favorited", payload: false })
                  }
                >
                  <StarIcon className="h-6 fill-white stroke-slate-300 stroke-1" />
                </button>
                <button
                  type="button"
                  className={classNames(
                    getIsActive("favorited", true)
                      ? "border border-green-600 bg-green-100"
                      : "border border-transparent",
                    "rounded p-1"
                  )}
                  onClick={() => dispatch({ type: "favorited", payload: true })}
                >
                  <StarIcon className="h-6 fill-yellow-300 stroke-1" />
                </button>
              </div>
            </li>
          </ul>
        </Popover.Panel>
      </div>
    </Popover>
  );
}

type Prefetch = "none" | "intent" | "render";

export function MylistNav({
  totalItemCount,
  itemsWithReviewCount,
}: {
  totalItemCount: number;
  itemsWithReviewCount: number;
}) {
  const navigation = useNavigation();
  const submit = useSubmit();
  const [searchParams] = useSearchParams();
  const { pathname } = useLocation();
  const {
    funcs: { getIsActive, getActiveFilters },
    formData,
    dispatch,
  } = useListNav();

  useEffect(() => {
    formData && submit(formData, { action: pathname });
  }, [formData]);

  const items = useMemo(
    () => [
      {
        name: "All",
        Icon: ListBulletIcon,
        to: "/list",
        count: totalItemCount,
        prefetch: "intent" as Prefetch,
        end: true,
      },
      {
        name: "Reviews",
        Icon: NewspaperIcon,
        to: "reviews",
        count: itemsWithReviewCount,
        prefetch: "intent" as Prefetch,
      },
    ],
    [totalItemCount, itemsWithReviewCount]
  );

  return (
    <div className="flex gap-4 shadow-[inset_0_-1px_0px] shadow-gray-300">
      {items.map((item, i) => (
        <NavLink
          key={i}
          end={item.end}
          className={({ isActive }) =>
            classNames(
              isActive
                ? " border-orange-600 font-semibold"
                : "border-transparent",
              "border-b-2 pt-2 pb-1"
            )
          }
          prefetch={item?.prefetch ?? "none"}
          to={`${item.to}?${searchParams}`}
        >
          <div className="flex items-center gap-2 rounded-md py-2 px-2 hover:bg-gray-100">
            <div className="flex gap-[1px]">
              <item.Icon className="mr-1 h-6 w-6 stroke-1" />
              <span>{item.name}</span>
            </div>
            <span className="rounded-full bg-gray-200 px-2 text-sm font-normal">
              {item.count}
            </span>
          </div>
        </NavLink>
      ))}

      <div className="ml-auto flex items-center">
        <div className="mr-2">
          <Spinner loading={navigation.state === "submitting"} />
        </div>

        <Form
          action={pathname}
          method="get"
          className="flex items-center gap-4"
        >
          <Filter
            active={getActiveFilters()}
            getIsActive={getIsActive}
            dispatch={dispatch}
          />
          <Sort getIsActive={getIsActive} dispatch={dispatch} />
        </Form>
      </div>
    </div>
  );
}

function Spinner({
  loading,
  className,
}: {
  loading: boolean;
  className?: string;
}) {
  const show = useSpinDelay(loading, { delay: 100, minDuration: 1000 });
  return show ? (
    <svg
      className={classNames(
        "-ml-1 mr-3 h-5 w-5 animate-spin text-sky-600",
        className
      )}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  ) : null;
}
