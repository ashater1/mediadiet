import { useTypedLoaderData } from "remix-typedjson";
import { PageFrame } from "~/features/ui/frames";
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
