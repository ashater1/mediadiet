import { useFetchers } from "@remix-run/react";
import { safeFilter } from "~/utils/funcs";

export function usePendingDeletions() {
  const fetchers = useFetchers();

  const pendingDeletions = fetchers
    .filter(
      (f) =>
        f.submission?.action.startsWith("/list") &&
        f.submission?.action.endsWith("/delete")
    )
    .map((f) => f.submission?.formData.get("id"));

  return safeFilter(pendingDeletions);
}
