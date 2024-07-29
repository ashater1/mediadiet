import { Form, useActionData, useNavigation } from "@remix-run/react";
import { ActionFunctionArgs, json } from "@vercel/remix";
import classNames from "classnames";
import { useEffect } from "react";
import { z } from "zod";
import Spinner from "~/components/spinner";
import { getAdminClient } from "~/features/auth/client.server";
import ResetPasswordEmail from "~/features/auth/emails/resetPassword";
import { findUser } from "~/features/auth/user.server";
import { resend } from "~/features/emails/resend.server";

export async function action({ request }: ActionFunctionArgs) {
  const response = new Response();
  const submission = Object.fromEntries(await request.formData());
  const emailSchema = z.object({
    email: z.string().email(),
  });

  const result = emailSchema.safeParse(submission);

  if (!result.success) {
    return json({ success: false, data: result.error.flatten().fieldErrors });
  }

  const adminClient = getAdminClient();
  const { data: authData, error } = await adminClient.auth.admin.generateLink({
    type: "recovery",
    email: result.data.email,
    options: {
      redirectTo: `http://localhost:3000/reset-password`,
    },
  });

  console.log(authData.properties?.action_link);

  if (!authData.user) {
    return json({ success: true, found: false }, { headers: response.headers });
  } else {
    const { username } = await findUser({ id: authData.user.id });
    if (!username || !authData.user.email)
      throw new Error("Username not found");

    const { data: emailData, error: emailError } = await resend.emails.send({
      from: "Adam <adam@mediadiet.app>",
      to: authData.user.email,
      subject: "Reset your password on mediadiet",
      react: (
        <ResetPasswordEmail
          username={username}
          resetPasswordLink={authData.properties.action_link}
        />
      ),
    });

    if (emailError) {
      throw new Error(emailError ? JSON.stringify(emailError) : "Email error");
    }

    return json({ success: true, found: true }, { headers: response.headers });
  }
}

export default function ForgotPassword() {
  const actionData = useActionData<typeof action>();

  const navigation = useNavigation();

  const loading =
    navigation.state !== "idle" &&
    navigation.formData?.get("actionId") === "forgotPassword";

  return (
    <div className="md:p-0 px-8 max-w-lg flex flex-col gap-y-5">
      <h2 className="self-start text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
        Reset your password
      </h2>
      <p className="text-sm">
        Enter the email address you used to sign up and we'll send you a link to
        reset your password.
      </p>
      <Form method="post" className="flex flex-col gap-y-5">
        <label htmlFor="email-address" className="sr-only">
          Email address
        </label>
        <input
          id="email-address"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="relative block w-full rounded-md border-b px-3 py-1.5 text-gray-900 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-primary-800 outline-none sm:text-sm sm:leading-6"
          placeholder="Email address"
        />
        <button
          name="actionId"
          value="forgotPassword"
          type="submit"
          disabled={loading}
          className={classNames(
            loading ? "mt-opacity-50" : "hover:bg-primary-700",
            "flex h-10 w-full items-center justify-center rounded-md bg-primary-800 text-sm font-semibold leading-6 text-white  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-800"
          )}
        >
          <div className="relative">
            {loading ? <Spinner className="w-5 h-5" /> : "Continue"}
          </div>
        </button>
      </Form>
    </div>
  );
}
