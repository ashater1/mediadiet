import { db } from "~/db.server";
import { getAvatarUrl } from "../auth/user.server";
import { getCoverArt } from "../list/utils.server";
import { listToString } from "~/utils/funcs";

// TODO - add rewatch functionality
export async function getFollowingFeed({
  userId,
  take = 30,
  skip = 0,
}: {
  userId: string;
  take?: number;
  skip?: number;
}) {
  const feed = await db.review.findMany({
    where: {
      user: {
        followedBy: {
          some: {
            followerId: userId,
          },
        },
      },
    },
    include: {
      user: {
        select: {
          firstName: true,
          lastName: true,
          username: true,
          avatar: true,
        },
      },
      mediaItem: {
        select: {
          releaseDate: true,
          coverArt: true,
          mediaType: true,
          title: true,
          creator: true,
          TvSeries: {
            select: {
              title: true,
            },
          },
        },
      },
    },
    take,
    skip,
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedFeed = feed.map((review) => {
    const title =
      review.mediaItem.mediaType === "TV"
        ? `${review.mediaItem.TvSeries?.title}${
            review.mediaItem.title ? ` - ${review.mediaItem.title}` : ""
          }`
        : review.mediaItem.title;

    const coverArt =
      review.mediaItem.coverArt &&
      getCoverArt({
        id: review.mediaItem.coverArt,
        mediaType: review.mediaItem.mediaType,
      });

    const verb =
      review.mediaItem.mediaType === "BOOK"
        ? "finished reading"
        : review.mediaItem.mediaType === "MOVIE"
        ? "watched"
        : "finished watching";

    return {
      verb,
      ...review,
      // isRewatch,
      mediaItem: {
        ...review.mediaItem,
        creator: listToString(review.mediaItem.creator.map((c) => c.name)),
        title,
        coverArt,
        releaseDate: review.mediaItem.releaseDate?.toISOString().slice(0, 4),
      },
      user: {
        ...review.user,
        avatar: review.user.avatar && getAvatarUrl(review.user.avatar),
        fullName: `${review.user.firstName} ${review.user.lastName}`,
      },
    };
  });

  return formattedFeed;
}
