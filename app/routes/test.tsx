import {
  Link,
  useFetcher,
  useLoaderData,
  useLocation,
  useSearchParams,
} from "@remix-run/react";
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
  const [searchParams, setSearchParams] = useSearchParams();

  searchParams.get("page");
  searchParams.set("page", "1");
  console.log(searchParams.toString());

  const allParams = Array.from(searchParams).reduce(
    (acc: { [key: string]: string | string[] }, [key, value]) => {
      if (key in acc) {
        if (Array.isArray(acc[key])) {
          acc[key] = [...acc[key], value];
        } else {
          acc[key] = [acc[key], value];
        }
      } else {
        acc[key] = value;
      }

      return acc;
    },
    {}
  );

  return (
    <PageFrame>
      <pre>{JSON.stringify(allParams, null, 2)}</pre>
      <pre>{JSON.stringify(searchParams, null, 2)}</pre>
      <button
        className="px-2 py-1 bg-gray-200 rounded"
        onClick={() =>
          setSearchParams({ ...allParams, fuck: ["you", "youToo"] })
        }
      >
        Fucks
      </button>
    </PageFrame>
  );
}
