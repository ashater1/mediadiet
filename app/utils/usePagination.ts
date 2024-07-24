import { useInView } from "framer-motion";
import { useRef, useState } from "react";

export function usePagination() {
  let [page, setPage] = useState(1);
  const infiniteScrollRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(infiniteScrollRef);

  function incrementPage() {
    setPage((p) => p + 1);
  }

  function decrementPage() {
    setPage((p) => p - 1);
  }

  function resetPage() {
    setPage(1);
  }

  return {
    isInView,
    page,
    incrementPage,
    decrementPage,
    resetPage,
    infiniteScrollRef,
  };
}
