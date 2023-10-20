import {
  BookOpenIcon,
  HandThumbDownIcon,
  HandThumbUpIcon,
  HeartIcon,
  NewspaperIcon,
  StarIcon,
  TrashIcon,
  TvIcon,
  VideoCameraIcon,
} from "@heroicons/react/24/outline";
import classNames from "classnames";
import { ComponentProps } from "react";
import { MediaType } from "../types";
import { Spinner } from "~/components/login/Spinner";

type ComponentPropsType<T> = ComponentProps<
  T extends keyof JSX.IntrinsicElements | React.JSXElementConstructor<any>
    ? T
    : never
>;

type RatingIconProps<T> = {
  isOn?: boolean;
  className?: string;
} & ComponentPropsType<T>;

export function ThumbsDown({
  isOn = false,
  className,
  ...props
}: RatingIconProps<typeof HandThumbDownIcon>) {
  return (
    <HandThumbDownIcon
      {...props}
      className={classNames(
        isOn
          ? "fill-red-300 stroke-slate-700 stroke-[1.2]"
          : "fill-transparent stroke-slate-500 stroke-1",
        "h-5 w-5 scale-x-flip transition-all duration-300 md:h-6 md:w-6",
        className && className
      )}
    />
  );
}

export function MehThumb({
  isOn = false,
  className,
  ...props
}: RatingIconProps<typeof HandThumbUpIcon>) {
  return (
    <HandThumbUpIcon
      {...props}
      className={classNames(
        isOn
          ? "fill-orange-200 stroke-slate-700  stroke-[1.2]"
          : "fill-transparent stroke-slate-500 stroke-1",
        "h-5 w-5 rotate-90 transition-all duration-300 md:h-6 md:w-6",
        className && className
      )}
    />
  );
}

export function ThumbsUp({
  isOn = false,
  className,
  ...props
}: RatingIconProps<typeof HandThumbUpIcon>) {
  return (
    <HandThumbUpIcon
      {...props}
      className={classNames(
        isOn
          ? "fill-green-300 stroke-slate-700  stroke-[1.2]"
          : "fill-transparent stroke-slate-500 stroke-1",
        "h-5 w-5 transition-all duration-300 md:h-6 md:w-6",
        className && className
      )}
    />
  );
}

export function FavoriteStar({
  isOn = false,
  className,
  ...props
}: RatingIconProps<typeof StarIcon>) {
  return (
    <StarIcon
      className={classNames(
        isOn
          ? "fill-yellow-300 stroke-slate-700 stroke-[1.2]"
          : "fill-transparent stroke-slate-500 stroke-1",
        "h-5 w-5 transition-all duration-300 md:h-6 md:w-6",
        className && className
      )}
    />
  );
}

export function FavoriteHeart({
  isOn = false,
  className,
  ...props
}: RatingIconProps<typeof StarIcon>) {
  return (
    <HeartIcon
      className={classNames(
        isOn
          ? "fill-red-300 stroke-slate-700 stroke-1"
          : "fill-transparent stroke-slate-500 stroke-1",
        "h-5 w-5 transition-all duration-300 md:h-5 md:w-5",
        className && className
      )}
    />
  );
}

export function ReviewIcon({
  isOn = false,
  className,
  ...props
}: RatingIconProps<typeof HandThumbUpIcon>) {
  return (
    <NewspaperIcon
      className={classNames(
        isOn
          ? "fill-orange-100 stroke-slate-700 stroke-[1.2]"
          : "fill-transparent stroke-slate-300 stroke-1",
        "h-5 w-5 transition-all duration-300 md:h-5 md:w-5",
        className && className
      )}
    />
  );
}

export function MovieIcon({
  className,
  ...props
}: { className?: string } & ComponentPropsType<typeof VideoCameraIcon>) {
  return (
    <VideoCameraIcon
      {...props}
      className={classNames(
        "h-5 w-5 fill-blue-300 stroke-black md:h-5 md:w-5",
        className
      )}
    />
  );
}

export function TvShowIcon({
  className,
  ...props
}: { className?: string } & ComponentPropsType<typeof TvIcon>) {
  return (
    <TvIcon
      {...props}
      className={classNames(
        "h-5 w-5 fill-slate-700 stroke-purple-800 md:h-5 md:w-5",
        className && className
      )}
    />
  );
}

export function BookIcon({
  className,
  ...props
}: { className?: string } & ComponentPropsType<typeof TvIcon>) {
  return (
    <BookOpenIcon
      {...props}
      className={classNames(
        "h-5 w-5 fill-orange-200 md:h-5 md:w-5",
        className && className
      )}
    />
  );
}

export function DeleteButton({
  isBeingDeleted,
  onClick,
}: {
  onClick?: (args?: any) => void;
  isBeingDeleted?: boolean;
}) {
  return (
    <button
      disabled={isBeingDeleted}
      onClick={onClick}
      className="flex items-center justify-center rounded-md bg-black bg-opacity-20 p-1 text-sm font-medium text-white transition-all duration-200 hover:bg-opacity-30 md:p-1.5 md:px-4 md:py-2  md:opacity-20 md:hover:opacity-100"
    >
      <span className="sr-only">Delete</span>

      {isBeingDeleted ? (
        <Spinner diameter={5} />
      ) : (
        <TrashIcon className="h-5 w-5 fill-gray-300 stroke-gray-600 md:h-6 md:w-6" />
      )}
    </button>
  );
}

export function StarsDisplay({
  stars,
  size = 6,
}: {
  stars: number;
  size?: number;
}) {
  if (stars === 0) return null;

  const heightAndWidth = `h-${size} w-${size}`;
  return (
    <>
      {[...Array(stars)].map((_, i) => (
        <StarIcon
          key={i}
          className={classNames(
            heightAndWidth,
            "fill-yellow-300 stroke-black stroke-[0.75px]"
          )}
        />
      ))}
    </>
  );
}
