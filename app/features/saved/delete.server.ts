import { z } from "zod";
import { db } from "~/db.server";

export const deleteSavedItemSchema = z.object({
  mediaItemId: z.string(),
  userId: z.string(),
});

type DeleteSavedItemProps =
  | { savedId: string }
  | { mediaItemId: string; userId: string };

export async function deleteSavedItem(props: DeleteSavedItemProps) {
  if ("savedId" in props) {
    const result = await db.mediaItemForLater.delete({
      where: {
        id: props.savedId,
      },
      select: {
        mediaItem: {
          select: {
            title: true,
          },
        },
      },
    });

    return { success: true, title: result.mediaItem.title };
  } else if ("mediaItemId" in props) {
    const result = await db.mediaItemForLater.delete({
      where: {
        mediaItemId_userId: {
          mediaItemId: props.mediaItemId,
          userId: props.userId,
        },
      },
      select: {
        mediaItem: {
          select: {
            title: true,
          },
        },
      },
    });

    return { success: true, title: result.mediaItem.title };
  } else throw new Error("Invalid arguments");
}
