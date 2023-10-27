import { QuestionMarkCircleIcon } from "@heroicons/react/20/solid";
import * as Tooltip from "@radix-ui/react-tooltip";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@vercel/remix";
import { z } from "zod";
import Spinner from "~/components/spinner";
import { db } from "~/db.server";
import { getUserDetails, getUserOrRedirect } from "~/features/auth/auth.server";
import { useIsLoading } from "~/utils/useIsLoading";

const profileSchema = z.object({
  firstName: z.string(),
  lastName: z.string().nullish(),
  soderberghMode: z.coerce.boolean(),
});

export async function loader({ request }: LoaderFunctionArgs) {
  const response = new Response();
  const userDetails = await getUserDetails({ request, response });
  return json({ ...userDetails });
}

export async function action({ request }: ActionFunctionArgs) {
  const response = new Response();
  const user = await getUserOrRedirect({ request, response });
  const formData = Object.fromEntries(await request.formData());
  const { firstName, lastName, soderberghMode } = profileSchema.parse(formData);

  const updatedUser = await db.user.update({
    where: { id: user.id },
    data: {
      firstName,
      lastName,
      soderberghMode,
    },
  });

  return null;
}

export default function Profile() {
  const data = useLoaderData<typeof loader>();
  const loading = useIsLoading({ value: "settings" });

  return (
    <div className="flex">
      <Form method="post" className="flex flex-col gap-8 w-60">
        <div>
          <h2 className="text-lg font-semibold mb-2">Profile</h2>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col">
              <label className="text-sm" htmlFor="username">
                Username
              </label>
              <input
                name="username"
                defaultValue={data.username}
                disabled
                className="disabled:bg-white disabled:text-slate-400 mt-1 px-2 py-1 border rounded outline-none focus:ring-2 focus:ring-inset focus:ring-primary-800"
              />
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col">
                <label className="text-sm" htmlFor="firstName">
                  First name
                </label>
                <input
                  name="firstName"
                  id="firstName"
                  defaultValue={data.firstName ?? ""}
                  className="text-sm mt-1 px-2 py-1 border rounded outline-none focus:ring-2 focus:ring-inset focus:ring-primary-800"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm" htmlFor="lastName">
                  Last name
                </label>
                <input
                  name="lastName"
                  id="lastName"
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
            <TooltipDemo />
          </div>
          <div className="flex items-center gap-3">
            <label htmlFor="soderberghMode">Enabled</label>
            <input
              defaultChecked={!!data.soderberghMode}
              type="checkbox"
              id="soderberghMode"
              name="soderberghMode"
            />
          </div>
        </div>
        <button
          name="actionId"
          value="settings"
          type="submit"
          className="disabled:opacity-50 disabled:bg-primary-800 flex items-center justify-center text-sm bg-primary-800 active:bg-primary-600 hover:bg-primary-700 py-2 text-slate-50 rounded"
        >
          {loading ? <Spinner className="h-5 w-5" /> : "Save changes"}
        </button>
      </Form>
    </div>
  );
}

const TooltipDemo = () => {
  return (
    <Tooltip.Provider delayDuration={0}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <QuestionMarkCircleIcon className="fill-primary-800 w-5 h-5 hover:fill-primary-700 active:fill-primary-600" />
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            side="right"
            className="whitespace-pre-line text-sm w-64 p-2.5 shadow-lg border bg-primary-50 rounded"
            sideOffset={5}
          >
            <p>
              Inspired by Steven Soderbergh's annual{" "}
              <Link
                to="https://extension765.com/blogs/soderblog/seen-read-2022"
                target="_blank"
                className="italic underline"
              >
                SEEN, READ
              </Link>{" "}
              list, this gives users a more minimialist option to just track
              what they've watched and read, and mark the things they really
              liked.
            </p>
            <Tooltip.Arrow className="fill-white" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};
