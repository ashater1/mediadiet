import classNames from "classnames";
import React from "react";

export default function DataCell({
  className,
  children,
  ...props
}: {
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLDataElement>) {
  return (
    <td
      className={classNames(
        className,
        "px-2 py-3.5 align-middle md:px-5 md:py-3.5"
      )}
    >
      {children}
    </td>
  );
}
