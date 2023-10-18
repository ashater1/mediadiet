import classNames from "classnames";
import { forwardRef } from "react";

type ButtonProps = React.ComponentPropsWithoutRef<"button">;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => (
    <button
      {...props}
      className={classNames(
        "rounded-md border border-gray-500 bg-slate-600 bg-opacity-20 px-4 py-2 text-sm font-medium text-white outline-none ring-0 hover:bg-slate-800 hover:bg-opacity-30 focus:border-white/90 active:bg-slate-900",
        props.className
      )}
    >
      {props.children}
    </button>
  )
);
