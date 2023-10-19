import { LoaderFunctionArgs, redirect } from "@vercel/remix";
import { getUserDetails } from "~/features/auth/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const response = new Response();
  const user = await getUserDetails({ request, response });
  if (!user?.id) throw redirect("/login", { headers: response.headers });
  throw redirect(`$/{usermame}`, { headers: response.headers });
}
