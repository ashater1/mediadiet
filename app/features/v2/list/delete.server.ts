import { db } from "~/db.server";

export async function deleteEntry(id: string) {
  try {
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

    return { title };
  } catch (e) {
    return { success: false, error: e };
  }
}
