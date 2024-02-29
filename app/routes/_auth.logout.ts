import { LoaderFunctionArgs, redirect } from "@vercel/remix";
import { signOut } from "~/features/auth/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const response = new Response();
  const errors = await signOut({ request, response });
  if (errors) return errors;
  throw redirect("/login", { headers: response.headers });
}
