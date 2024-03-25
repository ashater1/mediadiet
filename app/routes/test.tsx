import { useTypedLoaderData } from "remix-typedjson";
import { db } from "~/db.server";
import { PageFrame } from "~/components/frames";
import { useSearch } from "~/features/v2/search/useSearch";

export async function loader() {
  return null;
}

export default function Test() {
  const { isLoading, mediaType, results, search } = useSearch();

  return (
    <PageFrame>
      <div>
        <input onChange={(e) => search(e.target.value)} />
        <div>{String(isLoading)}</div>
        <div>{mediaType}</div>
        <pre>{JSON.stringify(results, null, 2)}</pre>
      </div>
    </PageFrame>
  );
}
