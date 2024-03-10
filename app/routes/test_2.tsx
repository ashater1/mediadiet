import { Form } from "@remix-run/react";
import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@vercel/remix";
import { getToast, setToast } from "~/features/toasts/toast.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const response = new Response();
  const toast = await getToast({ request, response });
  return json(null, { headers: response.headers });
}

export async function action({ request }: ActionFunctionArgs) {
  const response = new Response();

  const body = await request.formData();
  const intent = body.get("intent");

  if (intent === "do-nothing") {
    return json({ data: "data" }, { headers: response.headers });
  } else if (intent === "set-toast") {
    let toast = {
      title: new Date().toISOString(),
      description: new Date().toISOString(),
    };

    await setToast({ request, response, toast });

    return json({ data: "data" }, { headers: response.headers });
  }
}

export default function OtherTest() {
  return (
    <div className="p-20">
      <Form method="post">
        <button
          name="intent"
          value="set-toast"
          type="submit"
          className="px-4 py-2 rounded-md border bg-slate-50"
        >
          Test toast
        </button>

        <button
          className="px-4 py-2 rounded-md border bg-slate-50"
          type="submit"
          name="intent"
          value="do-nothing"
        >
          Do nothing
        </button>
      </Form>
    </div>
  );
}
