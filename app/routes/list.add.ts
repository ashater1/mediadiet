import { ActionFunctionArgs, json } from "@vercel/remix";
import { getUserOrRedirect } from "~/features/v2/auth/user.server";
import { AddToListSchema, addNewEntry } from "~/features/v2/list/add.server";
import { setToast } from "~/features/v2/toasts/toast.server";

export async function action({ request }: ActionFunctionArgs) {
  const response = new Response();
  const user = await getUserOrRedirect({ request, response });
  const formData = await request.formData();
  const submission = Object.fromEntries(formData);

  // TODO - Make sure book release date is passed and added to db for book entries
  const result = AddToListSchema.safeParse(submission);

  if (!result.success) {
    return { success: false };
  } else {
    let dbResult = await addNewEntry({ userId: user.id, ...result.data });
    if (!dbResult.success) throw new Error("Failed to add entry");
    await setToast({
      request,
      response,
      toast: {
        type: "success",
        title: "Nice!",
        description: `Added ${dbResult.title} to your list`,
      },
    });
    return json({ success: true }, { headers: response.headers });
  }
}
