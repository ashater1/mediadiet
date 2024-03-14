import { db } from "~/db.server";

type FollowFunctionProps = {
  followerId: string;
  followedId: string;
};

export async function followUserById({
  followerId,
  followedId,
}: FollowFunctionProps) {
  const followResult = await db.follows.upsert({
    where: {
      followedId_followerId: {
        followedId,
        followerId,
      },
    },
    create: {
      followedId,
      followerId,
    },
    update: {},
  });

  return { success: true, followResult };
}

export async function unfollowUserById({
  followerId,
  followedId,
}: FollowFunctionProps) {
  const unfollowResult = await db.follows.delete({
    where: {
      followedId_followerId: {
        followedId,
        followerId,
      },
    },
  });

  return { success: true, unfollowResult };
}
