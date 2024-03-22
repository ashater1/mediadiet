import { MediaType } from "@prisma/client";
import { useFetcher } from "@remix-run/react";
import _ from "lodash";
import { useEffect, useMemo, useState } from "react";
import { loader as bookSearchLoader } from "~/routes/search.book._index";
import { loader as movieSearchLoader } from "~/routes/search.movie._index";
import { loader as tvSearchLoader } from "~/routes/search.tv._index";

// TODO - move this to useReducer

export function useSearch() {
  const [mediaType, setMediaType] = useState<MediaType>("MOVIE");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  let {
    data: searchData,
    load: searchLoad,
    state: searchState,
  } = useFetcher<
    typeof bookSearchLoader | typeof tvSearchLoader | typeof movieSearchLoader
  >();

  const debouncedSearch = useMemo(() => {
    return _.debounce(
      ({
        mediaType,
        searchTerm,
      }: {
        mediaType: MediaType;
        searchTerm: string;
      }) => {
        const encodedSearchTerm = encodeURIComponent(searchTerm);
        searchLoad(`/search/${mediaType}?searchTerm=${encodedSearchTerm}`);
        setIsLoading(false);
      },
      1000
    );
  }, []);

  useEffect(() => {
    if (!searchTerm.trim() || !mediaType) {
      setIsLoading(false);
      debouncedSearch.cancel();
      return;
    }

    if (searchTerm.trim() && mediaType) {
      !isLoading && setIsLoading(true);
      debouncedSearch({
        mediaType: mediaType,
        searchTerm: searchTerm.trim(),
      });
    }
  }, [searchTerm]);

  return {
    mediaType,
    searchTerm,
    setMediaType,
    search: setSearchTerm,
    results: searchData,
    isLoading: isLoading || searchState !== "idle",
  };
}
