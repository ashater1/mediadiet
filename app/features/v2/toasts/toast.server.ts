import { getSession, commitSession } from "~/sessions.server";

export type Toast = {
  id: string;
  type: "success" | "neutral" | "error" | "warning" | "deleted";
  description?: string;
  title: string;
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
  const newToast = {
    id: new Date().toISOString(),
    type: toast.type,
    title: toast.title,
    description: toast.description,
  };

  const session = await getSession(request.headers.get("Cookie"));
  const toasts = session.get("toast");
  if (toasts) {
    session.flash("toast", [
      ...toasts,
      {
        id: new Date().toISOString(),
        type: toast.type,
        title: toast.title,
        description: toast.description,
      },
    ]);
  } else {
    session.flash("toast", [newToast]);
  }

  response.headers.append("Set-Cookie", await commitSession(session));
}

export async function getToast({
  request,
  response,
}: {
  request: Request;
  response: Response;
}) {
  // TODO - migrate to making toasts an array instead of single toast
  const session = await getSession(request.headers.get("Cookie"));
  const toasts = session.get("toast");
  response.headers.append("Set-Cookie", await commitSession(session));
  return toasts;
}
