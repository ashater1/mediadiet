import { getSession, commitSession } from "~/sessions.server";

export type Toast = {
  id: string;
  title: string;
  description: string;
};

export async function setToast({
  request,
  response,
  toast,
}: {
  request: Request;
  response: Response;
  toast: Omit<Toast, "id">;
}) {
  const session = await getSession(request.headers.get("Cookie"));

  session.flash("toast", {
    id: new Date().toISOString(),
    title: toast.title,
    description: toast.description,
  });

  response.headers.append("Set-Cookie", await commitSession(session));
}

export async function getToast({
  request,
  response,
}: {
  request: Request;
  response: Response;
}) {
  const session = await getSession(request.headers.get("Cookie"));
  const toast = session.get("toast");
  response.headers.append("Set-Cookie", await commitSession(session));
  return toast;
}
