import { MediaType } from "@prisma/client";
import { db } from "~/db.server";

export async function getEntryListCounts({ username }: { username: string }) {
  const [movieCount, bookCount, tvCount] = await db.$transaction([
    db.user.findFirstOrThrow({
      where: {
        username,
      },
      include: {
        _count: {
          select: {
            Review: {
              where: {
                mediaItem: {
                  mediaType: MediaType.MOVIE,
                },
              },
            },
          },
        },
      },
    }),
    db.user.findFirstOrThrow({
      where: {
        username,
      },
      include: {
        _count: {
          select: {
            Review: {
              where: {
                mediaItem: {
                  mediaType: MediaType.BOOK,
                },
              },
            },
          },
        },
      },
    }),
    db.user.findFirstOrThrow({
      where: {
        username,
      },
      include: {
        _count: {
          select: {
            Review: {
              where: {
                mediaItem: {
                  mediaType: MediaType.TV,
                },
              },
            },
          },
        },
      },
    }),
  ]);

  return {
    movieCount: movieCount._count.Review,
    bookCount: bookCount._count.Review,
    tvCount: tvCount._count.Review,
  };
}
