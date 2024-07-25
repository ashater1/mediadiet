import { ActionFunctionArgs, json, redirect } from "@vercel/remix";
import invariant from "tiny-invariant";
import { getUserDetails } from "~/features/auth/user.server";
import {
  deleteSavedItem,
  deleteSavedItemSchema,
} from "~/features/saved/delete.server";
import { setToast } from "~/features/toasts/toast.server";

export async function action({ request }: ActionFunctionArgs) {
  const response = new Response();
  const user = await getUserDetails({ request, response });
  if (!user) throw redirect("/login", { headers: response.headers });

  const formData = await request.formData();
  const mediaItemId = formData.get("mediaItemId")?.toString();
  invariant(mediaItemId, "mediaItemId is required");

  console.log("Deleting " + mediaItemId + " from " + user.id + "'s list");

  const deleteResult = await deleteSavedItem({
    mediaItemId,
    userId: user.id,
  });

  if (deleteResult?.success) {
    await setToast({
      request,
      response,
      toast: {
        type: "deleted",
        title: "All set",
        description: `${deleteResult.title} has been deleted from your saved list`,
      },
    });
  }

  return json({ success: true }, { headers: response.headers });
}
