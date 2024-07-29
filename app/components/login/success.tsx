import { CheckCircleIcon } from "@heroicons/react/20/solid";
import { Link } from "@remix-run/react";

export function Success({ children }: { children?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center w-full">
      <div className="flex gap-3 items-center">
        <CheckCircleIcon className="w-12 h-12 fill-green-500 stoke-white" />
        {children}
      </div>
    </div>
  );
}
