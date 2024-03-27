import { db } from "~/db.server";

export async function getCounts(username: string) {
  const { _count } = await db.user.findFirstOrThrow({
    where: { username },
    select: {
      _count: {
        select: {
          followedBy: true,
          following: true,
        },
      },
    },
  });

  return _count;
}
