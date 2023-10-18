import { useState } from "react";

export function BookInputs({ audiobook = false }: { audiobook?: boolean }) {
  const [_isAudiobook, setIsAudiobook] = useState(audiobook);

  return (
    <div className="flex items-center">
      <label htmlFor="audiobook" className="flex items-center gap-2">
        Audiobook
      </label>
      <input
        checked={_isAudiobook}
        className="ml-3"
        id="audiobook"
        name="audiobook"
        onChange={(e) => setIsAudiobook(e.target.checked)}
        type="checkbox"
      />
    </div>
  );
}

export function MovieInputs({
  isInTheater = false,
  isOnPlane = false,
}: {
  isInTheater?: boolean;
  isOnPlane?: boolean;
}) {
  const [_isInTheater, setIsInTheater] = useState(false);
  const [_isOnPlane, setIsOnPlane] = useState(false);

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

      <label
        htmlFor="plane"
        className="flex items-center gap-2 whitespace-nowrap"
      >
        Watched on a plane
      </label>

      <input
        onChange={(e) => onPlaneSelect(e.target.checked)}
        checked={_isOnPlane}
        id="plane"
        name="plane"
        type="checkbox"
        className="ml-auto p-1"
      />
    </>
  );
}
