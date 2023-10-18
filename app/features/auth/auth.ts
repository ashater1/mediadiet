import {
  createSupabaseClient,
  RequestResponse,
} from "../../utils/supabase/supabase.server";
import { redirect } from "@vercel/remix";
import { ServerSideAuth } from "./types";
import { db } from "~/utils/db.server";

export async function getAuthUser({ request, response }: RequestResponse) {
  const supabaseClient = createSupabaseClient({ request, response });

  const {
    data: { user },
  } = await supabaseClient.auth.getUser();

  return user;
}

export async function getAuthSession({ request, response }: RequestResponse) {
  const supabaseClient = createSupabaseClient({ request, response });

  const {
    data: { session },
  } = await supabaseClient.auth.getSession();

  return { session };
}

export async function getDbUser({ request, response }: RequestResponse) {
  const userId = await getAuthUser({ request, response });
  if (!userId) return null;

  const user = await db.user.findFirst({
    where: {
      id: userId.id,
    },
  });

  if (!user)
    throw new Error(`auth.user with id ${userId} not found in public.users`);

  return user;
}

export async function getIsLoggedIn({ request, response }: RequestResponse) {
  let session = await getAuthSession({ request, response });
  return !!session;
}

export async function authenticateOrRedirect({
  request,
  response,
  redirectTo = "/login",
}: RequestResponse & { redirectTo?: string }) {
  let { session } = await getAuthSession({ request, response });

  if (!session) {
    throw redirect(redirectTo, { headers: response.headers });
  }
}

export async function LoginCheckSession({
  request,
  response,
}: RequestResponse) {
  let session = await getAuthSession({ request, response });
  if (session) {
    throw redirect("/");
  }
}

export async function signOut({ request, response }: RequestResponse) {
  const supabaseClient = createSupabaseClient({
    request,
    response,
  });

  const { error } = await supabaseClient.auth.signOut();
  if (error) return error;

  throw redirect("/login", { headers: response.headers });
}

export async function signInWithPassword({
  email,
  password,
  request,
  response,
}: ServerSideAuth) {
  const supabaseClient = createSupabaseClient({
    request,
    response,
  });

  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email,
    password,
  });

  return { data, error };
}

export async function signInWithOAuth({ request, response }: RequestResponse) {
  const supabaseClient = createSupabaseClient({
    request,
    response,
  });

  const { data, error } = await supabaseClient.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: "https://www.mediadiet-app.vercel.app" },
  });

  return { data, error };
}

export async function signUp({
  email,
  password,
  username,
  request,
  response,
}: {
  email: string;
  password: string;
  username: string;
  request: Request;
  response: Response;
}) {
  const supabaseClient = createSupabaseClient({
    request,
    response,
  });

  const { data, error } = await supabaseClient.auth.signUp({
    email,
    password,
  });

  console.log({ data, error });

  if (error) {
    throw error;
  }

  if (data.user?.id) {
    await db.user.create({
      data: {
        id: data.user.id,
        username,
        email,
      },
    });
  }

  return { data };
}

export async function getUsername(id: string) {
  const { username } = await db.user.findFirstOrThrow({
    where: {
      id,
    },
    select: {
      username: true,
    },
  });

  return username;
}
