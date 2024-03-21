import { db } from "~/db.server";

export async function deleteSavedItem(id: string) {
  await db.mediaItemForLater.delete({
    where: {
      id,
    },
  });
}
