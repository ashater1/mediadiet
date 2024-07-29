import { useActionData, useLocation, useSubmit } from "@remix-run/react";
import { ActionFunctionArgs, json, redirect } from "@vercel/remix";
import { useEffect } from "react";
import { z } from "zod";
import { PageFrame } from "~/components/frames";
import Spinner from "~/components/spinner";
import { getServerClient } from "~/features/auth/client.server";
import { getSessionUser, getUserDetails } from "~/features/auth/user.server";

const resetPasswordTokenSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
});

export async function loader({ request }: ActionFunctionArgs) {
  const response = new Response();
  const session = await getSessionUser({ request, response });

  if (!!session) {
    throw redirect("/reset-password", { headers: response.headers });
  }

  return json(null, { headers: response.headers });
}
export async function action({ request }: ActionFunctionArgs) {
  const response = new Response();
  const formData = Object.fromEntries(await request.formData());
  const submission = resetPasswordTokenSchema.safeParse(formData);
  if (!submission.success) {
    return json({ sucess: submission.success }, { headers: response.headers });
  }

  const serverClient = getServerClient({ request, response });
  await serverClient.auth.setSession({
    access_token: submission.data.access_token,
    refresh_token: submission.data.refresh_token,
  });

  console.log("Redirecting to /reset-password");
  throw redirect("/reset-password", { headers: response.headers });
}

export default function PasswordRedirect() {
  const actionData = useActionData<typeof action>();
  const location = useLocation();
  const submit = useSubmit();
  const searchParams = Object.fromEntries(
    new URLSearchParams(location.hash.split("#")[1])
  );

  useEffect(() => {
    submit(searchParams, {
      method: "post",
      action: "/reset-password/redirect",
    });
  }, []);

  return null;
}
