import { MediaType } from "@prisma/client";
import classNames from "classnames";
import { useFetcher } from "react-router-dom";
import {
  BookIcon,
  DeleteButton,
  FavoriteStar,
  MovieIcon,
  ReviewIcon,
  ThumbsDown,
  ThumbsUp,
  TvShowIcon,
} from "~/features/v2/list/icons/icons";

function Dot() {
  return (
    <svg viewBox="0 0 2 2" className="h-[3px] w-[3px] fill-gray-400">
      <circle cx={1} cy={1} r={1} />
    </svg>
  );
}

export type ListItemProps = {
  canDelete: boolean;
  consumedDate: string;
  creators: string;
  favorited?: boolean;
  hasReview?: boolean;
  id: string;
  img: string | null;
  isBeingDeleted: boolean;
  mediaType: MediaType;
  rating: "liked" | "disliked" | null;
  releaseYear: string | null;
  title: string;
};

export function ListItem({
  canDelete,
  consumedDate,
  creators,
  favorited,
  hasReview,
  id,
  img,
  isBeingDeleted,
  mediaType,
  rating,
  releaseYear,
  title,
}: ListItemProps) {
  const { submit } = useFetcher();

  const deleteEntry = async ({
    id,
    mediaType,
  }: {
    id: string;
    mediaType: MediaType;
  }) => {
    submit({ id }, { action: `/list/${mediaType}/delete`, method: "post" });
  };

  return (
    <div
      className={classNames(
        isBeingDeleted && "opacity-30 transition-opacity duration-100",
        "group flex items-center gap-6 py-2 px-3 md:py-4"
      )}
    >
      <div className="w-8 flex-shrink-0 text-end text-xs text-white/90">
        {consumedDate}
      </div>

      <div className="flex-shrink-0">
        {mediaType === "MOVIE" ? (
          <MovieIcon />
        ) : mediaType === "TV" ? (
          <TvShowIcon />
        ) : (
          <BookIcon />
        )}
      </div>

      <div className="hidden w-12 rounded-sm md:block">
        {img && <img className="h-auto w-full rounded-sm" src={img} />}
      </div>

      <div className="flex w-full min-w-0 flex-grow-0 flex-col gap-1 text-sm md:w-96 md:text-base">
        <p className="text-white/90 line-clamp-2">{title}</p>
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/70 line-clamp-2 md:text-sm">
            {creators}
          </span>
          <Dot />
          <span className="text-xs text-white/70 md:text-sm">
            {releaseYear}
          </span>
        </div>
      </div>

      <div className="ml-auto flex flex-shrink-0 items-center justify-center gap-1 text-sm md:ml-10 md:gap-1.5">
        {rating === "liked" ? (
          <ThumbsUp className="h-4 w-4" isOn />
        ) : rating === "disliked" ? (
          <ThumbsDown className="h-4 w-4" isOn />
        ) : null}
        {favorited && <FavoriteStar className="h-4 w-4" isOn />}
        {hasReview && <ReviewIcon className="h-4 w-4" isOn />}
      </div>

      {canDelete && (
        <DeleteButton
          isBeingDeleted={isBeingDeleted}
          onClick={() => deleteEntry({ id, mediaType })}
        />
      )}
    </div>
  );
}
