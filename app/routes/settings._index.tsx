import { LoaderFunctionArgs, redirect } from "@vercel/remix";

export async function loader({ request }: LoaderFunctionArgs) {
  throw redirect("profile", { headers: request.headers });
}
