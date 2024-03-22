import { useOutletContext } from "@remix-run/react";
import { SerializeFrom } from "@vercel/remix";
import { loader } from "~/routes/$username";

export type ListOwnerContextType = SerializeFrom<typeof loader>;

export function useListOwnerContext() {
  return useOutletContext<ListOwnerContextType>();
}
