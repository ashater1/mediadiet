import { redirect } from "@vercel/remix";
import { getServerClient } from "./client.server";
import { db } from "~/db.server";

export function getAvatarUrl(avatar: string) {
  return `https://cgoipxithucvtnbvyypv.supabase.co/storage/v1/object/public/public/avatars/${avatar}`;
}

export async function findUser(args: { id: string } | { username: string }) {
  if ("id" in args) {
    return db.user.findFirstOrThrow({ where: { id: args.id } });
  } else if ("username" in args) {
    return db.user.findFirstOrThrow({ where: { username: args.username } });
  }

  throw new Error("Invalid arguments");
}

export async function getSessionUser({
  request,
  response,
}: {
  request: Request;
  response: Response;
}) {
  const serverClient = getServerClient({ request, response });
  const {
    data: { user },
  } = await serverClient.auth.getUser();

  return user;
}

export async function getUserOrRedirect({
  to = "/login",
  request,
  response,
}: {
  to?: string;
  request: Request;
  response: Response;
}) {
  const user = await getSessionUser({ request, response });

  if (!user) {
    throw redirect(to, { headers: response.headers });
  }

  return user;
}

export async function getUserDetails({
  request,
  response,
}: {
  request: Request;
  response: Response;
}) {
  const user = await getSessionUser({ request, response });
  if (!user) return null;

  const userDetails = await findUser({ id: user.id });
  return {
    ...userDetails,
    avatar: userDetails.avatar && getAvatarUrl(userDetails.avatar),
  };
}
