import { QuestionMarkCircleIcon } from "@heroicons/react/20/solid";
import { Form, Link, NavLink, useLoaderData } from "@remix-run/react";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from "@vercel/remix";
import classNames from "classnames";
import {
  getSession,
  getUserDetails,
  getUserOrRedirect,
} from "~/features/auth/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const response = new Response();
  const userDetails = await getUserDetails({ request, response });
  return json({ ...userDetails });
}

export async function action({ request }: ActionFunctionArgs) {
  const response = new Response();
  await getUserOrRedirect({ request, response });
  const submission = Object.fromEntries(await request.formData());
  console.log({ ...submission });
  return null;
}

export default function Profile() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="flex">
      <Form className="flex flex-col gap-8 w-60">
        <div>
          <h2 className="text-lg font-semibold mb-2">Profile</h2>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col">
              <label className="text-sm" htmlFor="username">
                Username
              </label>
              <input
                defaultValue={data.username}
                disabled
                className="disabled:bg-white disabled:text-slate-400 mt-1 px-2 py-1 border rounded outline-none focus:ring-2 focus:ring-inset focus:ring-primary-800"
              />
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col">
                <label className="text-sm" htmlFor="first-name">
                  First name
                </label>
                <input
                  defaultValue={data.firstName ?? ""}
                  className="text-sm mt-1 px-2 py-1 border rounded outline-none focus:ring-2 focus:ring-inset focus:ring-primary-800"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm" htmlFor="last-name">
                  Last name
                </label>
                <input
                  defaultValue={data.lastName ?? ""}
                  className="text-sm mt-1 px-2 py-1 border rounded outline-none focus:ring-2 focus:ring-inset focus:ring-primary-800"
                />
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-lg font-semibold">Soderbergh Mode</h2>
            <QuestionMarkCircleIcon className="fill-primary-800 w-5 h-5 hover:fill-primary-700 active:fill-primary-600" />
          </div>
          <div className="flex items-center gap-3">
            <label htmlFor="soderberghMode">Enabled</label>
            <input
              onChange={(e) => console.log(e.target.checked)}
              defaultChecked={data.soderberghMode}
              type="checkbox"
              id="soderberghMode"
              name="soderberghMode"
            />
          </div>
        </div>
        <button className="text-sm bg-primary-800 active:bg-primary-600 hover:bg-primary-700 py-2 text-slate-50 rounded">
          Save changes
        </button>
      </Form>
    </div>
  );
}
