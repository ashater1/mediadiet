import { Form, Link, useSearchParams, useSubmit } from "@remix-run/react";
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
  const [searchParams] = useSearchParams();
  const mediaTypes = searchParams.getAll("type");

  console.log(searchParams.getAll("poop"));
  return (
    <div className="p-20">
      <Form
        onChange={(e) => {
          submit(e.currentTarget);
        }}
        className="relative flex  divide-x divide-slate-300 md:ml-auto self-auto md:self-end"
      >
        <CountsWithParams
          count={2}
          label="movies"
          defaultChecked={mediaTypes.includes("movie")}
          active={!mediaTypes.length || mediaTypes.includes("movie")}
          name="type"
          value="movie"
        />

        <CountsWithParams
          count={4}
          label="books"
          defaultChecked={mediaTypes.includes("book")}
          active={!mediaTypes.length || mediaTypes.includes("book")}
          name="type"
          value="book"
        />

        <CountsWithParams
          count={8}
          label="seasons"
          defaultChecked={mediaTypes.includes("tv")}
          active={!mediaTypes.length || mediaTypes.includes("tv")}
          name="type"
          value="tv"
        />
      </Form>
    </div>
  );
}
