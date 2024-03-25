import { createCookieSessionStorage } from "@vercel/remix";
import { Toast } from "~/features/v2/toasts/toast.server";

export const { getSession, commitSession, destroySession } =
  createCookieSessionStorage<never, { toast: Toast[] }>({
    // a Cookie from `createCookie` or the CookieOptions to create one
    cookie: {
      name: "__session",
    },
  });
