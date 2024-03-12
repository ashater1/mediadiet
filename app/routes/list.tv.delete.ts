import { ActionFunctionArgs } from "@vercel/remix";
import invariant from "tiny-invariant";
import { getUserOrRedirect } from "~/features/auth/auth.server";
import { db } from "~/db.server";

export async function action({ request }: ActionFunctionArgs) {
  const response = new Response();
  await getUserOrRedirect({ request, response });
  const body = await request.formData();
  const id = body.get("id")?.toString();
  invariant(id, "Review ID is required to delete a tv review");

  const deletedEntry = await db.tvReview.delete({
    where: { id: id },
    select: {
      tvSeason: {
        select: {
          title: true,
          tvShow: {
            select: {
              title: true,
            },
          },
        },
      },
    },
  });

  return {
    show: deletedEntry.tvSeason.tvShow.title,
    season: deletedEntry.tvSeason.title,
  };
}
