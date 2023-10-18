import stylesheet from "~/tailwind.css";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { Analytics } from "@vercel/analytics/react";
import type { LinksFunction } from "@vercel/remix";
import Navbar from "./features/nav/Navbar";
import { ToastContext } from "./components/toasts/context";
import { AddNewContext } from "./features/add/context";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
  { rel: "stylesheet", href: "https://rsms.me/inter/inter.css" },
];

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-gradient-to-tr from-orange-100 via-pink-100 to-indigo-50 w-screen h-screen">
        <ToastContext>
          <AddNewContext>
            <Navbar username="adam" />
            <Outlet />
            <ScrollRestoration />
            <Scripts />
            <LiveReload />
            <Analytics />
          </AddNewContext>
        </ToastContext>
      </body>
    </html>
  );
}
