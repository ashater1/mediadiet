import { cn } from "~/components/utils";

export function Button({
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "flex h-10 items-center justify-center rounded-md active:bg-primary-600 hover:bg-primary-700 bg-primary-800 text-sm font-semibold leading-6 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-800",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
