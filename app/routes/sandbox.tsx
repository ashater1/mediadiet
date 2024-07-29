import {
  useActionData,
  useLoaderData,
  useLocation,
  useSearchParams,
} from "@remix-run/react";
import { ActionFunctionArgs, json } from "@vercel/remix";
import { PageFrame } from "~/components/frames";
import ConfirmEmailAddressEmail from "~/features/auth/emails/confirmSignup";
import ResetPasswordEmail from "~/features/auth/emails/resetPassword";
import { getFollowedThatHaveLogged } from "~/features/tvAndMovies/db";

export async function loader() {
  const response = new Response();

  return json({ loaderData: "loaderData" }, { headers: response.headers });
}

export async function action({ request }: ActionFunctionArgs) {
  const response = new Response();
  const formData = Object.fromEntries(await request.formData());

  return json(
    { actionData: "actionData", ...formData },
    { headers: response.headers }
  );
}

export default function Test() {
  const location = useLocation();
  const searchParams = Object.fromEntries(
    new URLSearchParams(location.hash.split("#")[1])
  );

  const loaderData = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  return (
    <PageFrame>
      <pre>{JSON.stringify(searchParams, null, 2)}</pre>
      {/* {actionData ? (
        <pre>{JSON.stringify(actionData, null, 2)}</pre>
      ) : (
        <pre>{JSON.stringify(loaderData, null, 2)}</pre>
      )} */}
    </PageFrame>
  );
}
