import { useInView } from "framer-motion";
import { useRef, useState } from "react";

export function useInfiniteScroll() {
  let [page, setPage] = useState(1);

  const infiniteScrollRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(infiniteScrollRef);

  const incrementPage = () => {
    setPage((p) => p + 1);
  };

  const decrementPage = () => {
    setPage((p) => p - 1);
  };

  return {
    isInView,
    page,
    incrementPage,
    decrementPage,
    infiniteScrollRef,
  };
}
