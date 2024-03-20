import { Prisma } from "@prisma/client";
import { format } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { db } from "~/db.server";
import { UserEntriesTable } from "~/features/list/components/userEntriesTable_V2";
import { PageFrame } from "~/features/ui/frames";
import { listToString } from "~/utils/funcs";

const query = Prisma.validator<Prisma.UserFindFirstArgs>()({
  select: {
    Review: {
      include: {
        MediaItem: {
          include: {
            TvSeries: true,
            creator: true,
          },
        },
      },
      take: 5,
      orderBy: {
        consumedDate: "desc",
      },
    },
  },
});

export type Review = Prisma.UserGetPayload<typeof query>["Review"][number];

export type Reivew_V2 = ReturnType<typeof formatReview>;

function formatReview(review: Review) {
  let { creator, releaseDate, ...mediaItem } = review.MediaItem;
  let { review: textReview, consumedDate, createdAt, ..._review } = review;

  let _consumedDate = formatInTimeZone(review.consumedDate, "utc", "M/d");

  let _createdAt =
    review.createdAt && formatInTimeZone(review.createdAt, "utc", "M/d");

  let releaseYear = releaseDate && formatInTimeZone(releaseDate, "utc", "yyyy");

  let _creator = listToString(review.MediaItem.creator.map((c) => c.name));
  let hasReview = !!textReview;

  let title = mediaItem.TvSeries
    ? `${mediaItem.TvSeries.title} - ${mediaItem.title}`
    : mediaItem.title;

  return {
    hasReview,
    consumedDate: _consumedDate,
    createdAt: _createdAt,
    ..._review,
    MediaItem: { ...mediaItem, title, releaseYear, creator: _creator },
  };
}

export async function loader() {
  const entries = await db.user.findFirst({
    where: {
      username: "adam",
    },
    ...query,
  });

  return typedjson({ data: entries?.Review.map(formatReview) ?? [] });
}

export default function Test() {
  const data = useTypedLoaderData<typeof loader>();

  return (
    <PageFrame>
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
      <UserEntriesTable entries={data.data ?? []} />
    </PageFrame>
  );
}
