import { useFetcher, useLoaderData } from "@remix-run/react";
import { LoaderFunctionArgs, json } from "@vercel/remix";
import { PageFrame } from "~/components/frames";
import { useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  let page = url.searchParams.get("page");
  let pageNumber = page ? parseInt(page) ?? 1 : 1;
  console.log({ pageNumber });
  return json({
    data: [...Array(pageNumber * 20).keys()],
  });
}

export default function Test() {
  const data = useLoaderData<typeof loader>();
  const [dataState, setDataState] = useState(data);

  const ref = useRef(null);
  const isInView = useInView(ref);
  const fetcher = useFetcher<typeof loader>();
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!isInView) return;
    console.log("Fetching more shit!");
    fetcher.load(`/test?page=${page}`);
    setPage((p) => p + 1);
  }, [isInView]);

  useEffect(() => {
    if (!fetcher.data || fetcher.state === "loading") {
      return;
    }
    // If we have new data - append it
    if (fetcher.data) {
      const newItems = fetcher.data.data;
      setDataState((d) => ({
        data: [...d.data, ...newItems],
      }));
    }
  }, [fetcher.data]);

  return (
    <PageFrame>
      <div>
        {data &&
          dataState.data.map((_, i) => (
            <div key={i} className="flex gap-2 items-center">
              Fuck face
            </div>
          ))}
        <div ref={ref} className="py-10 bg-red-300 w-full" id="scrollTrigger" />
      </div>
    </PageFrame>
  );
}
