import { db } from "~/db.server";

export async function deleteEntry(id: string) {
  try {
    const { mediaItem } = await db.review.delete({
      where: { id: id },
      select: {
        mediaItem: {
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
      mediaItem.mediaType === "TV"
        ? `${mediaItem.TvSeries?.title}${
            mediaItem.title ? ` - ${mediaItem.title}` : ""
          }`
        : mediaItem.title;

    return { title };
  } catch (e) {
    return { success: false, error: e };
  }
}
