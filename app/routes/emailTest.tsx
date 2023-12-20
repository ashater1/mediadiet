import { json } from "@remix-run/node";
import { LoaderFunctionArgs } from "@vercel/remix";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const data = await resend.emails.send({
      from: "Adam <adam@mediadiet.app>",
      to: "mediadietapp@gmail.com",
      subject: "Hello world",
      html: "<strong>It works!</strong>",
    });

    return json(data, 200);
  } catch (error) {
    return json({ error }, 400);
  }
}

export default function EmailTest() {
  return <div className="p-20">Email test</div>;
}
