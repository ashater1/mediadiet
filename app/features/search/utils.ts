import invariant from "tiny-invariant";

export function getSearchTerm(requestUrl: string) {
  const url = new URL(requestUrl);
  const searchTerm = url.searchParams.get("searchTerm")?.trim();
  invariant(searchTerm, "Passed a blank or empty search term");
  return searchTerm;
}
