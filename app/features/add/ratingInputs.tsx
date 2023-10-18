import {
  PaperAirplaneIcon,
  StarIcon,
  VideoCameraIcon,
} from "@heroicons/react/24/outline";
import { RatingBar } from "./RatingBar";
import { useState } from "react";
import * as Slider from "@radix-ui/react-slider";
import classNames from "classnames";

function DateInput() {
  return (
    <input
      name="consumedDate"
      className="border"
      type="date"
      defaultValue={new Date().toISOString().slice(0, 10)}
    />
  );
}

function ReviewInput() {
  return (
    <textarea
      name="review"
      placeholder="Add your blurb here..."
      defaultValue={""}
      rows={5}
      className="w-full rounded-md border border-slate-500 p-2"
    />
  );
}

export function MovieRatingInputs() {
  return (
    <>
      <div className="mt-5 flex items-center">
        <RatingBar />
        <div className="ml-12 flex-col justify-center gap-2">
          <MovieInputs />
        </div>
      </div>
      <DateInput />
      <ReviewInput />
    </>
  );
}

function MovieInputs() {
  const [isInTheater, setIsInTheater] = useState(false);
  const [isOnPlane, setIsOnPlane] = useState(false);

  return (
    <>
      <div className="flex gap-3">
        <label
          htmlFor="audiobook"
          className="flex items-center gap-2 whitespace-nowrap"
        >
          <VideoCameraIcon className="ml-3 h-4 w-4" />
          <span className="text-sm">In theater</span>
        </label>

        <input
          onChange={(e) => setIsInTheater(e.target.checked)}
          defaultChecked={false}
          checked={isInTheater}
          disabled={isOnPlane}
          id="inTheater"
          name="inTheater"
          type="checkbox"
          className="p-1"
        />
      </div>

      <div className="flex gap-3">
        <label
          htmlFor="plane"
          className="flex items-center gap-2 whitespace-nowrap"
        >
          <PaperAirplaneIcon className="ml-3 h-4 w-4" />
          <span className="text-sm">On a plane</span>
        </label>
        <input
          defaultChecked={false}
          onChange={(e) => setIsOnPlane(e.target.checked)}
          checked={isOnPlane}
          disabled={isInTheater}
          id="onPlane"
          name="onPlane"
          type="checkbox"
          className="ml-auto p-1"
        />
      </div>
    </>
  );
}

export function BookRatingInputs() {
  return (
    <div className="flex flex-col space-y-4">
      <DateInput />
      <RatingBar />
      <ReviewInput />
    </div>
  );
}

export function TvRatingInputs() {
  return (
    <div>
      <DateInput />
      <RatingBar />
      <ReviewInput />
    </div>
  );
}
