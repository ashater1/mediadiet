import { redirect } from "@vercel/remix";
import { getServerClient } from "./client.server";

export async function signOut({
  request,
  response,
}: {
  request: Request;
  response: Response;
}) {
  const serverClient = getServerClient({ request, response });
  const { error } = await serverClient.auth.signOut();
  if (error) return error;
  throw redirect("/login", { headers: response.headers });
}
