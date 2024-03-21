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
}: {
  username: string;
  mediaTypes: MediaType[];
}) {
  const saved = await db.user.findFirstOrThrow({
    where: {
      username,
    },
    include: {
      MediaItemForLater: {
        orderBy: {
          createdAt: "desc",
        },
        include: {
          mediaItem: {
            include: {
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
