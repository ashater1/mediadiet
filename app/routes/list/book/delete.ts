import { ActionFunctionArgs } from "@vercel/remix";
import invariant from "tiny-invariant";
import { authenticateOrRedirect } from "~/features/auth";
import { db } from "~/utils/db.server";

export async function action({ request }: ActionFunctionArgs) {
  const response = new Response();
  await authenticateOrRedirect({ request, response });
  const body = await request.formData();
  const id = body.get("id")?.toString();
  invariant(id, "Review ID is required to delete a book review");

  const deletedEntry = await db.bookReview.delete({
    where: { id: id },
  });

  return deletedEntry;
}
