import { useFetchers } from "@remix-run/react";
import { safeFilter } from "~/utils/funcs";

export function usePendingDeletions() {
  const fetchers = useFetchers();

  const pendingDeletions = fetchers
    .filter(
      (f) =>
        f.formAction?.startsWith("/list") && f.formAction?.endsWith("/delete")
    )
    .map((f) => f.formData?.get("id"));

  return safeFilter(pendingDeletions);
}
