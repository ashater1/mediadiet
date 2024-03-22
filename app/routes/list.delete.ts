import { ActionFunctionArgs, json } from "@vercel/remix";
import invariant from "tiny-invariant";
import { getUserOrRedirect } from "~/features/auth/auth.server";
import { db } from "~/db.server";
import { setToast } from "~/features/toasts/toast.server";

export async function action({ request }: ActionFunctionArgs) {
  const response = new Response();
  await getUserOrRedirect({ request, response });
  const body = await request.formData();
  const id = body.get("id")?.toString();
  invariant(id, "Review ID is required to delete a review");

  const { MediaItem } = await db.review.delete({
    where: { id: id },
    select: {
      MediaItem: {
        select: {
          mediaType: true,
          title: true,
          TvSeries: {
            select: {
              title: true,
            },
          },
        },
      },
    },
  });

  const title =
    MediaItem.mediaType === "TV"
      ? `MediaItem.TvSeries?.title${
          MediaItem.title ? ` - ${MediaItem.title}` : ""
        }`
      : MediaItem.title;

  await setToast({
    request,
    response,
    toast: {
      type: "deleted",
      title: `You deleted your review of ${title}`,
    },
  });

  return json({ success: true }, { headers: response.headers });
}
