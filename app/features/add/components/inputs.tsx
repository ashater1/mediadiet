import { useState } from "react";

export function BookInputs({ isAudiobook }: { isAudiobook: boolean }) {
  return (
    <div className="flex items-center">
      <label htmlFor="audiobook" className="flex items-center gap-2">
        Audiobook
      </label>
      <input
        defaultChecked={isAudiobook}
        className="ml-3"
        id="audiobook"
        name="audiobook"
        type="checkbox"
      />
    </div>
  );
}

export function MovieInputs({
  isInTheater,
  isOnPlane,
}: {
  isInTheater: boolean;
  isOnPlane: boolean;
}) {
  const [_isInTheater, setIsInTheater] = useState(isInTheater);
  const [_isOnPlane, setIsOnPlane] = useState(isOnPlane);

  const onTheaterSelect = (checked: boolean) => {
    setIsInTheater(checked);
    setIsOnPlane(false);
  };

  const onPlaneSelect = (checked: boolean) => {
    setIsOnPlane(checked);
    setIsInTheater(false);
  };

  return (
    <>
      <div className="flex gap-4">
        <label
          htmlFor="inTheater"
          className="flex items-center gap-2 whitespace-nowrap"
        >
          Watched in a theater
        </label>

        <input
          onChange={(e) => onTheaterSelect(e.target.checked)}
          checked={_isInTheater}
          id="inTheater"
          name="inTheater"
          type="checkbox"
          className="ml-auto p-1"
        />
      </div>

      <div className="flex gap-4">
        <label
          htmlFor="plane"
          className="flex items-center gap-2 whitespace-nowrap"
        >
          Watched on a plane
        </label>

        <input
          onChange={(e) => onPlaneSelect(e.target.checked)}
          checked={_isOnPlane}
          id="onPlane"
          name="onPlane"
          type="checkbox"
          className="ml-auto p-1"
        />
      </div>
    </>
  );
}
