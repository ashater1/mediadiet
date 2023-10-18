import classNames from "classnames";
import { PropsWithChildren } from "react";

export const CenterWrapper = ({
  children,
  gap = 0,
}: PropsWithChildren & { gap?: number }) => {
  return (
    <div
      className={classNames(
        `gap-${gap}`,
        "flex w-full items-center justify-center"
      )}
    >
      {children}
    </div>
  );
};
