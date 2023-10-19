import { createServerClient } from "@supabase/auth-helpers-remix";
import { redirect } from "@vercel/remix";
import { z } from "zod";
import { db } from "~/db.server";

type RequestResponse = {
  request: Request;
  response: Response;
};

const getServerClient = ({ request, response }: RequestResponse) => {
  return createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    { request, response }
  );
};

export async function getSession({ request, response }: RequestResponse) {
  const serverClient = getServerClient({ request, response });
  const {
    data: { session },
  } = await serverClient.auth.getSession();

  return session;
}

export async function getUser({
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
  to,
  request,
  response,
}: RequestResponse & { to: string }) {
  const serverClient = getServerClient({ request, response });

  const user = await getUser({ request, response });

  if (!user) {
    throw redirect(to);
  }

  return user;
}

export async function signInWithPassword({
  email,
  password,
  request,
  response,
}: {
  email: string;
  password: string;
} & RequestResponse) {
  const serverClient = getServerClient({ request, response });

  const { data, error } = await serverClient.auth.signInWithPassword({
    email,
    password,
  });

  return { data, error };
}

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

export async function getUserDetails({
  request,
  response,
}: {
  request: Request;
  response: Response;
}) {
  const user = await getUser({ request, response });
  if (!user) return null;

  const userDetails = await findUser(user.id);
  return userDetails;
}

export async function findUser(id: string) {
  const user = await db.user.findFirstOrThrow({
    where: { id },
  });

  return user;
}

export const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Incorrect email or password." }),
});
