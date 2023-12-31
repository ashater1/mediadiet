import { createServerClient } from "@supabase/auth-helpers-remix";
import { createClient } from "@supabase/supabase-js";
import { redirect } from "@vercel/remix";
import { z } from "zod";
import { db } from "~/db.server";

type RequestResponse = {
  request: Request;
  response: Response;
};

export const getAdminClient = () => {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
};

export const getServerClient = ({ request, response }: RequestResponse) => {
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
  to = "/login",
  request,
  response,
}: RequestResponse & { to?: string }) {
  const user = await getUser({ request, response });

  if (!user) {
    throw redirect(to);
  }

  return user;
}

export const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Incorrect email or password." }),
});

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

  const userDetails = await getUserById(user.id);
  return userDetails;
}

export async function getUserById(id: string) {
  const user = await db.user.findFirstOrThrow({
    where: { id },
  });

  return user;
}

export async function signUp({
  email,
  password,
  username,
}: {
  email: string;
  password: string;
  username: string;
}) {
  // const serverClient = getServerClient({
  //   request,
  //   response,
  // });

  const adminClient = getAdminClient();

  // convert username to lowercase
  let _username = username.toLowerCase();

  const [usernameExists, emailExists] = await Promise.all([
    db.user.findFirst({ where: { username: _username } }),
    db.user.findFirst({ where: { email } }),
  ]);

  if (!!usernameExists) {
    return {
      success: false,
      username: ["Username already exists."],
      email: null,
      password: null,
      confirmPassword: null,
    };
  }

  if (!!emailExists) {
    return {
      success: false,
      username: null,
      email: ["Email address is already being used."],
      password: null,
      confirmPassword: null,
    };
  }

  const { data, error } = await adminClient.auth.admin.generateLink({
    type: "signup",
    email,
    password,
  });

  if (error) {
    throw error;
  }

  if (data.user?.id) {
    await db.user.create({
      data: {
        id: data.user.id,
        username: _username,
        email,
      },
    });
  }

  return { success: true, link: data.properties.action_link };
}
