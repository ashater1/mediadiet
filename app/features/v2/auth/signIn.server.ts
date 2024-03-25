import { z } from "zod";
import { getServerClient } from "./client.server";

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
  request: Request;
  response: Response;
}) {
  const serverClient = getServerClient({ request, response });

  const { data, error } = await serverClient.auth.signInWithPassword({
    email,
    password,
  });

  return { data, error };
}
