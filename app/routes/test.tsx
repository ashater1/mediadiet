import { useLoaderData } from "@remix-run/react";
import Spinner from "~/components/spinner";

export async function loader() {
  const data = await fetch(
    "https://api.letterboxd.com/api/v0/search?input=the+matrix&searchMethod=Autocomplete&include=FilmSearchItem"
  );

  return await data.json();
}

export default function Test() {
  const data = useLoaderData<typeof loader>();

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
