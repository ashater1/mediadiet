import { useLoaderData } from "@remix-run/react";
import { LoaderFunctionArgs, redirect } from "@vercel/remix";
import { getUserDetails } from "~/features/auth/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const response = new Response();
  const user = await getUserDetails({ request, response });
  if (user?.username !== "adam") {
    throw redirect("/login", { headers: response.headers });
  }

  const data = await fetch(
    "https://api.letterboxd.com/api/v0/search?input=the+matrix&searchMethod=Autocomplete&include=FilmSearchItem"
  );

  return await data.json();
}

export default function Test() {
  const data = useLoaderData<typeof loader>();

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
