import { db } from "~/db.server";
import { getAvatarUrl } from "../auth/user.server";
import { differenceInDays, isThisYear, isToday } from "date-fns";
import { format } from "date-fns-tz";
import { z } from "zod";

function formatDateDistance(date: Date) {
  if (isToday(date)) {
    return "today";
  }

  const interval = differenceInDays(new Date(), date);

  if (interval < 7) return `${interval} days ago`;
  else if (isThisYear(date)) {
    return format(date, "MMM d");
  } else return format(date, "MMM d, yyyy");
}

const followersSchema = z.array(
  z.object({
    avatar: z
      .string()
      .nullable()
      .transform((val) => (val ? getAvatarUrl(val) : null)),
    first_name: z.string().nullish(),
    last_name: z.string().nullish(),
    username: z.string(),
    movie_count: z.number(),
    book_count: z.number(),
    tv_count: z.number(),
    created_date: z.date().transform(formatDateDistance),
  })
);

export async function getFollowers({
  page,
  userId,
}: {
  userId: string;
  page?: number;
}) {
  const result = await db.$queryRaw`
  select   
  avatar,
  username,
  public.user.created_date,
  first_name, 
  last_name, 
  coalesce(movie_count, 0)::integer as movie_count, 
  coalesce(book_count, 0)::integer as book_count, 
  coalesce(tv_count, 0)::integer as tv_count 
from
follows
join
public.user
on public.user.id = follows."followerId"
left outer join
(
  select user_id, count(*) as movie_count from
  review
  join
  media_item
  on media_item.id = review.media_item_id
  where media_type = 'MOVIE'
  group by user_id) as m
  on public.user.id = user_id
left outer join
(
  select user_id, count(*) as book_count from
  review
  join
  media_item
  on media_item.id = review.media_item_id
  where media_type = 'BOOK'
  group by user_id
) as b
on public.user.id = b.user_id
left outer join
(
  select user_id, count(*) as tv_count from
  review
  join
  media_item
  on media_item.id = review.media_item_id
  where media_type = 'TV'
  group by user_id
) as tv
on public.user.id = tv.user_id
where follows."followedId" = ${userId}::uuid
limit 30
offset ${page ? page * 30 : 0};
`;
  const parsedResult = followersSchema.parse(result);
  return parsedResult;
}

export async function getFollowing({
  page,
  userId,
}: {
  userId: string;
  page?: number;
}) {
  const result = await db.$queryRaw`
  select   
  avatar,
  username,
  public.user.created_date,
  first_name, 
  last_name, 
  coalesce(movie_count, 0)::integer as movie_count, 
  coalesce(book_count, 0)::integer as book_count, 
  coalesce(tv_count, 0)::integer as tv_count 
from
follows
join
public.user
on public.user.id = follows."followedId"
left outer join
(
  select user_id, count(*) as movie_count from
  review
  join
  media_item
  on media_item.id = review.media_item_id
  where media_type = 'MOVIE'
  group by user_id) as m
  on public.user.id = user_id
left outer join
(
  select user_id, count(*) as book_count from
  review
  join
  media_item
  on media_item.id = review.media_item_id
  where media_type = 'BOOK'
  group by user_id
) as b
on public.user.id = b.user_id
left outer join
(
  select user_id, count(*) as tv_count from
  review
  join
  media_item
  on media_item.id = review.media_item_id
  where media_type = 'TV'
  group by user_id
) as tv
on public.user.id = tv.user_id
where follows."followerId" = ${userId}::uuid
limit 30
offset ${page ? page * 30 : 0};
`;
  const parsedResult = followersSchema.parse(result);
  return parsedResult;
}
