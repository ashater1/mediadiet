import classNames from "classnames";

export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  return (
    <div
      className={classNames(
        size === "lg" ? "text-3xl font-bold" : "text-xl font-semibold",
        "tracking-tight "
      )}
    >
      <span>media</span>
      <span className="text-primary-800">diet</span>
    </div>
  );
}
