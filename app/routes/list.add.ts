import { ActionFunctionArgs } from "@vercel/remix";
import { getUserOrRedirect } from "~/features/v2/auth/user.server";
import { AddToListSchema, addNewEntry } from "~/features/v2/list/add.server";

export async function action({ request }: ActionFunctionArgs) {
  const response = new Response();
  const user = await getUserOrRedirect({ request, response });
  const formData = await request.formData();
  const submission = Object.fromEntries(formData);
  const result = AddToListSchema.safeParse(submission);

  if (!result.success) {
    return { success: false };
  } else {
    await addNewEntry({ userId: user.id, ...result.data });
  }
}
