import { LoaderFunctionArgs, redirect } from "@vercel/remix";
import { getUserDetails } from "~/features/auth/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const response = new Response();
  // Check if the user is logged in
  const user = await getUserDetails({ request, response });

  // If they aren't logged in, redirect them to the login page
  if (!user) {
    throw redirect("/login", { headers: response.headers });
  }

  // Otherwise, redirect them to their profile page
  throw redirect(`/${user.username}`, { headers: response.headers });
}
