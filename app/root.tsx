import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { Analytics } from "@vercel/analytics/react";
import {
  MetaFunction,
  type LinksFunction,
  type LoaderFunctionArgs,
} from "@vercel/remix";
import stylesheet from "~/tailwind.css";
import toastStylesheet from "~/toaststyle.css";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { AddNewContext } from "./features/add/context";
import { getUserDetails } from "./features/auth/auth.server";
import { UserContextProvider } from "./features/auth/context";
import { useIsAuthPage } from "./features/auth/hooks";
import Navbar from "./features/nav/Navbar";
import { getToast } from "./features/toasts/toast.server";
import { Toaster, toast } from "sonner";
import { useEffect } from "react";
import { TrashIcon } from "@heroicons/react/24/outline";

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
  { rel: "stylesheet", href: toastStylesheet },
  { rel: "stylesheet", href: "https://rsms.me/inter/inter.css" },
];

export async function loader({ request }: LoaderFunctionArgs) {
  const response = new Response();
  const user = await getUserDetails({ request, response });
  const toast = await getToast({ request, response });
  return typedjson({ user, toastData: toast }, { headers: response.headers });
}

export default function App() {
  const { user, toastData } = useTypedLoaderData<typeof loader>();
  const isAuthPage = useIsAuthPage();

  useEffect(() => {
    switch (toastData?.type) {
      case "success":
        toast.success(toastData.title, { description: toastData.description });
        break;
      case "deleted":
        toast.info(toastData.title, {
          description: toastData.description,
          icon: <TrashIcon />,
        });
        break;
      case "error":
        toast.error(toastData.title, { description: toastData.description });
        break;
      case "warning":
        toast.warning(toastData.title, { description: toastData.description });
        break;
      default:
        break;
    }
  }, [toastData]);

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="flex bg-gradient-to-tr from-orange-100 via-pink-100 to-indigo-50 h-full min-h-screen">
        <div className="h-full w-full">
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
        </div>
        <Toaster richColors position="bottom-right" />
      </body>
    </html>
  );
}
