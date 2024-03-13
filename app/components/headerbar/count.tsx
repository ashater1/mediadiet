import classNames from "classnames";

type CountComponentProps = {
  count: number;
  label: string;
};

type CountsWithParamsProps = CountComponentProps & {
  name: string;
  value: string;
  active: boolean;
  defaultChecked: boolean;
};

export function Count({ count, label }: CountComponentProps) {
  return (
    <>
      <span className="text-lg font-semibold tracking-tight text-gray-900 md:text-xl">
        {count}
      </span>
      <span className="ml-2">{label}</span>
    </>
  );
}

export function CountsWithParams({
  active,
  defaultChecked,
  count,
  label,
  name,
  value,
}: CountsWithParamsProps) {
  return (
    <div
      className={classNames(
        !active && "opacity-40",
        "flex transition-opacity duration-200 ease-in-out first:pl-0 px-4"
      )}
    >
      <label htmlFor={value} className="cursor-pointer">
        <Count count={count} label={label} />
      </label>
      <input
        hidden
        type="checkbox"
        name={name}
        id={value}
        value={value}
        defaultChecked={defaultChecked}
      />
    </div>
  );
}
