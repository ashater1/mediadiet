import { LoaderFunctionArgs } from "@vercel/remix";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { db } from "~/db.server";
import { UserEntriesTable } from "~/features/list/components/userEntriesTable_V2";
import { formatEntries, getEntries } from "~/features/v2/list/entries.server";
import { PageFrame } from "~/features/ui/frames";
import { getEntryListCounts } from "~/features/v2/list/counts.server";
import { movieDb } from "~/features/tvAndMovies";
import invariant from "tiny-invariant";
import { parse } from "date-fns";
import { Prisma } from "@prisma/client";

export async function loader() {
  let seasonId = "3624";
  let showId = "1399";

  const show = await movieDb.getShow(showId);
  const season = show.seasons?.find((s) => s?.id === seasonId);
  invariant(season, "No season found");

  const newShow = await db.mediaItem.upsert({
    where: {
      apiId: seasonId,
    },
    update: {},
    create: {
      apiId: seasonId,
      mediaType: "TV",
      title: season.name ?? "",
      releaseDate: season.air_date,
      coverArt: season.poster_path,
      length: season.episode_count,
      creator: {
        connectOrCreate: show.networks.map((studio) => ({
          where: {
            apiId_creatorType: {
              apiId: studio?.id ? String(studio.id) : "unknown",
              creatorType: "STUDIO" as const,
            },
          },
          create: {
            apiId: studio?.id ? String(studio.id) : "unknown",
            name: studio?.name ?? "unknown",
            creatorType: "STUDIO" as const,
          },
        })),
      },
      TvSeries: {
        connectOrCreate: {
          where: {
            apiId: showId,
          },
          create: {
            apiId: showId,
            title: show.name ?? "",
          },
        },
      },
    },
  });

  return typedjson({ newShow });
}

export default function Test() {
  const data = useTypedLoaderData<typeof loader>();

  return (
    <PageFrame>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      {/* <UserEntriesTable entries={data.data ?? []} /> */}
    </PageFrame>
  );
}
