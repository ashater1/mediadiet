import { useFetcher, useLoaderData } from "@remix-run/react";
import { LoaderFunctionArgs, json } from "@vercel/remix";
import { PageFrame } from "~/components/frames";
import { useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { db } from "~/db.server";
import { apStyleTitleCase } from "ap-style-title-case";

export async function loader({ request }: LoaderFunctionArgs) {
  const saved = await db.user.findFirstOrThrow({
    where: {
      username: "adam",
    },
    include: {
      MediaItemForLater: {
        take: 30,
        skip: 9999,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          mediaItem: {
            include: {
              TvSeries: true,
              creator: true,
            },
          },
        },
        where: {
          mediaItem: {
            mediaType: undefined,
          },
        },
      },
    },
  });

  console.log();
  return json(saved.MediaItemForLater);
}

export default function Test() {
  const data = useLoaderData<typeof loader>();

  return (
    <PageFrame>
      <div>{apStyleTitleCase("FUCK YOU!".toLowerCase())}</div>
    </PageFrame>
  );
}
