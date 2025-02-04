import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
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
import { AddNewContextProvider } from "./features/add/context";
import { UserContextProvider } from "./features/auth/context";
import { useIsAuthPage } from "./features/auth/hooks";
import Navbar from "./features/nav/Navbar";
import { getToast } from "./features/toasts/toast.server";
import { Toaster, toast } from "sonner";
import { useEffect } from "react";
import { TrashIcon } from "@heroicons/react/24/outline";
import { getUserDetails } from "./features/auth/user.server";
import { PageFrame } from "./components/frames";

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
  const toasts = await getToast({ request, response });
  return typedjson({ user, toasts }, { headers: response.headers });
}

export default function App() {
  const { user, toasts } = useTypedLoaderData<typeof loader>();
  const isAuthPage = useIsAuthPage();

  useEffect(() => {
    if (toasts && toasts.length > 0)
      toasts.forEach((t) => {
        switch (t.type) {
          case "success":
            toast.success(t.title, {
              description: t.description,
              id: t.id,
            });
            break;
          case "deleted":
            toast.info(t.title, {
              description: t.description,
              id: t.id,
              icon: <TrashIcon />,
            });
            break;
          case "error":
            toast.error(t.title, {
              description: t.description,
              id: t.id,
            });
            break;
          case "warning":
            toast.warning(t.title, {
              description: t.description,
              id: t.id,
            });
            break;
          default:
            break;
        }
      });
  }, [toasts]);

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="flex bg-gradient-to-tr from-orange-100 via-pink-100 to-indigo-50 h-full min-h-screen">
        <div className="h-full w-full">
          <AddNewContextProvider>
            <UserContextProvider user={user}>
              {!isAuthPage && <Navbar />}
              <Outlet />
              <ScrollRestoration />
              <Scripts />
              <LiveReload />
              <Analytics />
            </UserContextProvider>
          </AddNewContextProvider>
        </div>
        <Toaster richColors position="bottom-right" />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  return (
    <html>
      <head>
        <title>Oh no!</title>
        <Meta />
        <Links />
      </head>
      <body className="flex items-center justify-center bg-gradient-to-tr from-orange-100 via-pink-100 to-indigo-50 h-full min-h-screen">
        <PageFrame>
          <div className="w-full h-full flex flex-col items-center justify-center">
            <h3 className="text-2xl font-semibold">Whoops!</h3>
            <p className="text-sm">Looks like something went wrong.</p>
            <p className="text-sm">
              Try refreshing the page, or checking back later
            </p>
          </div>
        </PageFrame>
        <Scripts />
      </body>
    </html>
  );
}
