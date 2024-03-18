import { db } from "~/db.server";

type FollowFunctionProps = {
  followerId: string;
  followedId: string;
};

export async function followUserById({
  followerId,
  followedId,
}: FollowFunctionProps) {
  console.log({ followerId, followedId });

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
  console.log({ followerId, followedId });

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
