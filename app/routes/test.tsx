import { PageFrame } from "~/components/frames";
import { db } from "~/db.server";
import { useSearch } from "~/features/search/useSearch";

export async function getCounts(username: string) {
  let data = db.user.findFirst({
    where: { username },
  });

  return data;
}

export async function loader() {
  return await getCounts("adam");
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
