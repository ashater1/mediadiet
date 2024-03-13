import { db } from "~/db.server";

export async function getFollowers(username: string) {
  let {
    _count: { followedBy, following },
  } = await db.user.findFirstOrThrow({
    where: { username },
    select: {
      id: true,
      _count: { select: { following: true, followedBy: true } },
    },
  });

  return { followedBy, following };
}
