import { MediaType } from "@prisma/client";
import { RatingBar } from "../RatingBar";
import { BookInputs, MovieInputs } from "./inputs";
import classNames from "classnames";
import { cn } from "~/components/utils";

type HiddenInputs = { name: string; value: string };

export function EntryFormRoot({
  className,
  children,
  ...props
}: React.HTMLProps<HTMLDivElement>) {
  return (
    <div
      className={classNames(
        "flex h-[90vh] w-full gap-6 overflow-hidden p-3 md:h-[500px] md:w-[640px]",
        className
      )}
    >
      {children}
    </div>
  );
}

export function EntryFormImageRoot({
  className,
  children,
  ...props
}: React.HTMLProps<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={classNames(
        "-mt-40 hidden w-60 items-center rounded md:flex",
        className
      )}
    >
      {children}
    </div>
  );
}

export function EntryFormImage({
  className,
  src,
}: React.HTMLProps<HTMLImageElement>) {
  return (
    <img
      className={classNames("h-auto w-full rounded shadow-md ", className)}
      src={src}
    />
  );
}

export function EntryFormHeader({
  title,
  subHeaders,
}: {
  title?: string | null;
  subHeaders: string[];
}) {
  return (
    <>
      <h2 className="flex-shrink-0 py-1 text-2xl font-semibold text-gray-900 line-clamp-2">
        {title}
      </h2>

      <div className="flex flex-col md:flex-row md:items-center md:gap-3">
        {subHeaders.map((item, index) => (
          <div
            className={classNames(
              index === 0
                ? "flex-shrink flex-grow-0 truncate"
                : "flex-shrink-0",
              "flex gap-3"
            )}
          >
            <div className="truncate text-gray-500">{item}</div>
            <div key={index} className="hidden md:block">
              {index !== subHeaders.length - 1 && <span>&#x2022;</span>}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export function EntryFormInputs({
  audiobook = false,
  consumedDate,
  favorited = false,
  hiddenInputs = [],
  isInTheater = false,
  isOnPlane = false,
  mediaType,
  review = "",
  stars = null,
}: {
  audiobook?: boolean;
  consumedDate?: string;
  favorited?: boolean;
  hiddenInputs?: HiddenInputs[];
  isInTheater?: boolean;
  isOnPlane?: boolean;
  mediaType: MediaType;
  review?: string;
  stars?: number | null;
}) {
  return (
    <>
      <RatingBar favorited={favorited} stars={stars} />

      <div>
        <label htmlFor="date" className="block text-gray-500">
          Date watched
        </label>
        <input
          placeholder="Date watched"
          className="py-0.5  text-slate-900"
          id="consumedDate"
          name="consumedDate"
          defaultValue={
            consumedDate?.slice(0, 10) ?? new Date().toISOString().slice(0, 10)
          }
          max={new Date().toISOString().slice(0, 10)}
          type="date"
        />
      </div>

      <div className="grid grid-cols-[auto_auto] justify-start gap-x-4 gap-y-2 text-gray-500">
        <div
          className={cn(
            mediaType !== "MOVIE" && "hidden",
            "flex flex-col gap-3"
          )}
        >
          <MovieInputs isInTheater={isInTheater} isOnPlane={isOnPlane} />
        </div>
        <div className={cn(mediaType !== "BOOK" && "hidden")}>
          <BookInputs isAudiobook={audiobook} />
        </div>
      </div>

      <textarea
        name="review"
        className="flex h-full items-start justify-start border border-gray-200 p-2 text-black"
        placeholder="Write your review here..."
        defaultValue={review}
      />

      {hiddenInputs.map(({ name, value }) => (
        <input type="hidden" id={name} name={name} value={value} />
      ))}
    </>
  );
}
