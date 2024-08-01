import { z } from "zod";
import { db } from "~/db.server";
import { getAvatarUrl } from "~/features/auth/user.server";

const getFollowedThatHaveLoggedSchema = z.array(
  z.object({
    first_name: z.string().nullish(),
    last_name: z.string().nullish(),
    avatar: z.string().nullish(),
    username: z.string(),
    id: z.string(),
    has_review: z.boolean(),
    favorited: z.boolean().nullish().pipe(z.boolean().default(false)),
  })
);

export async function getFollowedThatHaveLogged({
  mediaItemId,
  userId,
}: {
  mediaItemId: string;
  userId: string;
}) {
  const result = await db.$queryRaw`
   select coalesce(review.review, '') <> '' as has_review,
          u.first_name,
          favorited,
          u.last_name,
          u.avatar, 
          u.username, 
          u.id from
    review
    join
    follows
    on follows."followedId" = review.user_id
    join
    public.user u
    on u.id = follows."followedId"
    where "followerId" = ${userId}::uuid
    and review.media_item_id = ${mediaItemId}::uuid;`;

  const parsedResult = getFollowedThatHaveLoggedSchema.parse(result);
  return parsedResult.map((f) => ({
    ...f,
    avatar: f.avatar && getAvatarUrl(f.avatar),
  }));
}
