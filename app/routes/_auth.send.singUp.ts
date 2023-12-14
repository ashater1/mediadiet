import { LoaderFunctionArgs, json } from "@vercel/remix";
import { resend } from "~/features/emails/resend.server";
import ConfirmEmailAddressEmail from "~/features/auth/emails/confirmSignup";

export async function loader({ request }: LoaderFunctionArgs) {
  const formData = Object.entries(await request.formData());
  console.log({ ...formData });
  return null;
  // try {
  //   const data = await resend.emails.send({
  //     from: "Acme <onboarding@resend.dev>",
  //     to: ["delivered@resend.dev"],
  //     subject: "Hello world",
  //     react: <ConfirmEmailAddressEmail />,
  //   });

  //   return json(data, 200);
  // } catch (error) {
  //   return json({ error }, 400);
  // }
}
