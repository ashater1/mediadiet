import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { Analytics } from "@vercel/analytics/react";
import {
  MetaFunction,
  json,
  type LinksFunction,
  type LoaderFunctionArgs,
} from "@vercel/remix";
import stylesheet from "~/tailwind.css";
import { ToastContext } from "./components/toasts/context";
import { AddNewContext } from "./features/add/context";
import { getUserDetails } from "./features/auth/auth.server";
import { UserContextProvider } from "./features/auth/context";
import { useIsAuthPage } from "./features/auth/hooks";
import Navbar from "./features/nav/Navbar";
import { Toaster, toast } from "sonner";
import { getToast } from "./features/toasts/toast.server";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { useEffect } from "react";

export const meta: MetaFunction = () => {
  return [
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    { charSet: "utf-8" },
    { title: "mediadiet" },
    {
      property: "og:title",
      content: "mediadiet",
    },
    {
      name: "description",
      content: "Track everything you've watched and read!",
    },
  ];
};

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
  { rel: "stylesheet", href: "https://rsms.me/inter/inter.css" },
];

export async function loader({ request }: LoaderFunctionArgs) {
  const response = new Response();

  // get user details to pass to root's UserContextProvider
  const user = await getUserDetails({ request, response });
  const toast = await getToast({ request, response });

  return typedjson({ user, toastData: toast }, { headers: response.headers });
}

export default function App() {
  const { user, toastData } = useTypedLoaderData<typeof loader>();
  const isAuthPage = useIsAuthPage();

  if (toastData) {
    toast.success(toastData.title, { id: toastData.id });
  }

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="flex bg-gradient-to-tr from-orange-100 via-pink-100 to-indigo-50 h-full min-h-screen">
        <div className="h-full w-full">
          <ToastContext>
            <AddNewContext>
              <UserContextProvider user={user}>
                {!isAuthPage && <Navbar />}
                <Outlet />
                <ScrollRestoration />
                <Scripts />
                <LiveReload />
                <Analytics />
              </UserContextProvider>
            </AddNewContext>
          </ToastContext>
          <Toaster richColors />
        </div>
      </body>
    </html>
  );
}
