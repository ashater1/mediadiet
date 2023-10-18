import { useEffect, useState } from "react";
import classNames from "classnames";
import { FavoriteHeart } from "../list/icons/icons";
import { StarIcon } from "@heroicons/react/24/outline";

export function RatingBar({
  stars = null,
  favorited = false,
}: {
  stars?: number | null;
  favorited?: boolean;
}) {
  const [_favorited, setFavorited] = useState<boolean>(favorited);
  const [_stars, setStars] = useState<number | null>(stars);

  const handleFavoriteClick = () => {
    setFavorited((favorited) => !favorited);
  };

  const handleRatingClick = (selectedRating: number) => {
    if (_stars === selectedRating) {
      setStars(null);
      return;
    }

    setStars(selectedRating);
  };

  return (
    <div className="flex gap-2">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-4 px-4">
          <div className="group flex flex-row-reverse items-center justify-center">
            {[...Array(5)].map((_, i) => (
              <StarIcon
                onClick={() => handleRatingClick(5 - i)}
                className={classNames(
                  typeof _stars === "number" &&
                    _stars >= 5 - i &&
                    "fill-yellow-300",
                  "peer h-6 w-6 cursor-pointer stroke-slate-600 stroke-[0.75px] hover:scale-105 active:scale-110 peer-hover:scale-105 peer-active:scale-110 md:h-8 md:w-8"
                )}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="mx-3 my-1 rounded border-l border-gray-300 py-2" />

      <button
        type="button"
        className={classNames(
          _favorited ? "border-pink-200 bg-pink-100" : "bg-transparent",
          "cursor-pointer rounded-full border border-gray-200 p-2 transition-colors focus:outline-none focus-visible:border-white"
        )}
        onClick={handleFavoriteClick}
      >
        <FavoriteHeart isOn={_favorited} />
      </button>

      <input name="rating" type="hidden" value={_stars ?? undefined} />
      <input name="favorited" type="hidden" value={_favorited.toString()} />
    </div>
  );
}
