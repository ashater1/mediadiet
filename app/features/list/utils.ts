import { z } from "zod";
import { getUserEntriesAndCounts } from "~/features/list/db/entries";
import { getUserDetails } from "../auth/auth.server";

const entryTypesSchema = z.array(z.enum(["book", "movie", "tv"]));

export function getEntryTypesFromUrl(url: string) {
  //   Check if url has filters & filter data if it does
  const _url = new URL(url);
  const entryTypes = _url.searchParams.getAll("type");
  const parsedEntryTypes = entryTypesSchema.parse(entryTypes);
  return parsedEntryTypes;
}

export async function getEntriesAndUserDetails({
  username,
  request,
  response,
}: {
  username: string;
  request: Request;
  response: Response;
}) {
  let entryTypes = getEntryTypesFromUrl(request.url);
  const [data, user] = await Promise.all([
    getUserEntriesAndCounts({ username, entryTypes }),
    getUserDetails({ request, response }),
  ]);

  return { data, user };
}
