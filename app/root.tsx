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
  json,
  MetaFunction,
  type LinksFunction,
  type LoaderFunctionArgs,
} from "@vercel/remix";
import stylesheet from "~/tailwind.css";
import { ToastContext } from "./components/toasts/context";
import { AddNewContext } from "./features/add/context";
import { getUserDetails } from "./features/auth/auth.server";
import { UserContextProvider } from "./features/auth/context";
import { useIsAuthPage } from "./features/auth/hooks";
import Navbar from "./features/nav/Navbar.1";

export const meta: MetaFunction = () => {
  return [
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    { charSet: "utf-8" },
  ];
};

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
  { rel: "stylesheet", href: "https://rsms.me/inter/inter.css" },
];

export async function loader({ request }: LoaderFunctionArgs) {
  const response = new Response();
  const user = await getUserDetails({ request, response });

  if (user) {
    const { username, firstName, lastName } = user;
    return json(
      { username, firstName, lastName },
      { headers: request.headers }
    );
  }

  return null;
}

export default function App() {
  const data = useLoaderData<typeof loader>();
  const isAuthPage = useIsAuthPage();

  return (
    <html className="min-h-screen" lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="h-full w-full bg-gradient-to-tr from-orange-100 via-pink-100 to-indigo-50 ">
        <ToastContext>
          <AddNewContext>
            <UserContextProvider user={data}>
              {!isAuthPage && <Navbar />}

              <Outlet />
              <ScrollRestoration />
              <Scripts />
              <LiveReload />
              <Analytics />
            </UserContextProvider>
          </AddNewContext>
        </ToastContext>
      </body>
    </html>
  );
}
