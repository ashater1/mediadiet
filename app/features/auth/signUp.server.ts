import { db } from "~/db.server";
import { getAdminClient } from "./client.server";

export async function signUp({
  email,
  password,
  username,
}: {
  email: string;
  password: string;
  username: string;
}) {
  const adminClient = getAdminClient();

  // convert username to lowercase
  let _username = username.toLowerCase();

  const [usernameExists, emailExists] = await Promise.all([
    db.user.findFirst({ where: { username: _username } }),
    db.user.findFirst({ where: { email } }),
  ]);

  if (!!usernameExists) {
    return {
      success: false as const,
      username: ["Username already exists."],
      email: null,
      password: null,
      confirmPassword: null,
    };
  }

  if (!!emailExists) {
    return {
      success: false as const,
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

  return { success: true as const, link: data.properties.action_link };
}
