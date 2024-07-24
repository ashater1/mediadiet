import { useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export function usePagination(
  args: { callback?: (args: { page: number }) => void } = {}
) {
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

  useEffect(() => {
    if (isInView) {
      incrementPage();
    }
  }, [isInView]);

  useEffect(() => {
    if (args.callback) {
      args.callback({ page });
    }
  }, [page]);

  return {
    isInView,
    page,
    incrementPage,
    decrementPage,
    resetPage,
    infiniteScrollRef,
  };
}
