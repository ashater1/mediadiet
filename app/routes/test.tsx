import { Form, Link, useSubmit } from "@remix-run/react";
import { CountsWithParams } from "~/components/headerbar/count";

function Count({ count, label }: { count: number; label: string }) {
  return (
    <label htmlFor={"a"} className="cursor-pointer">
      <span className="text-lg font-semibold tracking-tight text-gray-900 md:text-xl">
        {count}
      </span>
      <span className="ml-2">{label}</span>
    </label>
  );
}

export default function Test() {
  const submit = useSubmit();

  return (
    <div className="p-20">
      <Form
        onChange={(e) => {
          submit(e.currentTarget);
        }}
        className="relative flex  divide-x divide-slate-300 md:ml-auto self-auto md:self-end"
      >
        <CountsWithParams
          count={1}
          label={"you"}
          active={false}
          name="fuck"
          value="you"
        />
      </Form>
    </div>
  );
}
