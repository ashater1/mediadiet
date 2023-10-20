import { Link, NavLink, useLoaderData } from "@remix-run/react";
import { LoaderFunctionArgs, json } from "@vercel/remix";
import classNames from "classnames";
import { getUserDetails } from "~/features/auth/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const response = new Response();
  const userDetails = await getUserDetails({ request, response });
  return json({ ...userDetails });
}

export default function Profile() {
  const data = useLoaderData<typeof loader>();

  return <h2 className="text-lg font-semibold mb-2">Avatar</h2>;
}
