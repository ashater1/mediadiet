import { MediaType } from "@prisma/client";
import { formatInTimeZone } from "date-fns-tz";
import { db } from "~/db.server";
import { listToString } from "~/utils/funcs";

// TODO - Move types to Prisma type helper

type SavedItem = Awaited<ReturnType<typeof getSavedItems>>[number];

export function formatSavedItem(item: SavedItem) {
  const { createdAt, ..._item } = item;
  const { creator: _creator, ..._mediaItem } = item.mediaItem;

  const createdThisYear =
    new Date(createdAt).getFullYear() === new Date().getFullYear();

  const formattedCreatedAt = formatInTimeZone(
    createdAt,
    "utc",
    `${createdThisYear ? "MMMM" : "MMM"} d${!createdThisYear ? ", yyyy" : ""}`
  );

  const creator = listToString(_creator.map((c) => c.name));

  return {
    ..._item,
    createdAt: formattedCreatedAt,
    mediaItem: {
      ..._mediaItem,
      creator,
    },
  };
}

export async function getSavedItems({
  username,
  mediaTypes,
  take = 30,
  skip = 0,
}: {
  username: string;
  mediaTypes: MediaType[];
  take?: number;
  skip?: number;
}) {
  const saved = await db.user.findFirstOrThrow({
    where: {
      username,
    },
    include: {
      MediaItemForLater: {
        take,
        skip,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          mediaItem: {
            include: {
              TvSeries: true,
              creator: true,
            },
          },
        },
        where: {
          mediaItem: {
            mediaType: {
              in: mediaTypes,
            },
          },
        },
      },
    },
  });

  return saved?.MediaItemForLater;
}

export async function getSavedCounts({ username }: { username: string }) {
  const [movieCount, bookCount, tvCount] = await db.$transaction(
    ["MOVIE" as const, "BOOK" as const, "TV" as const].map((mediaType) =>
      db.user.findFirstOrThrow({
        where: { username },
        include: {
          _count: {
            select: {
              MediaItemForLater: {
                where: {
                  mediaItem: {
                    mediaType,
                  },
                },
              },
            },
          },
        },
      })
    )
  );

  return {
    movieCount: movieCount._count.MediaItemForLater,
    bookCount: bookCount._count.MediaItemForLater,
    tvCount: tvCount._count.MediaItemForLater,
  };
}
