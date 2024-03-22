import { MediaType } from "@prisma/client";
import { useFetcher } from "@remix-run/react";
import _ from "lodash";
import { useEffect, useMemo, useReducer, useState } from "react";
import { loader as bookSearchLoader } from "~/routes/search.book._index";
import { loader as movieSearchLoader } from "~/routes/search.movie._index";
import { loader as tvSearchLoader } from "~/routes/search.tv._index";

// TODO - move this to useReducer

type State = {
  mediaType: MediaType;
  searchTerm: string;
  isLoading: boolean;
};

type Action =
  | {
      type: "SET_MEDIA_TYPE";
      payload: MediaType;
    }
  | {
      type: "SET_SEARCH_TERM";
      payload: string;
    }
  | {
      type: "SET_LOADING";
      payload: boolean;
    };

const initialState = {
  mediaType: MediaType.MOVIE,
  searchTerm: "",
  isLoading: false,
};

function reducer(state: State, action: Action) {
  switch (action.type) {
    case "SET_MEDIA_TYPE":
      return { ...state, mediaType: action.payload };
    case "SET_SEARCH_TERM":
      return { ...state, searchTerm: action.payload };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
}

export function useSearch() {
  const [state, dispatch] = useReducer(reducer, initialState);

  let {
    data: searchData,
    load: searchLoad,
    state: searchState,
  } = useFetcher<
    typeof bookSearchLoader | typeof tvSearchLoader | typeof movieSearchLoader
  >();

  const setMediaType = (mediaType: MediaType) => {
    dispatch({ type: "SET_MEDIA_TYPE", payload: mediaType });
  };

  const setSearchTerm = (searchTerm: string) => {
    dispatch({ type: "SET_SEARCH_TERM", payload: searchTerm });
  };

  const setLoadingStatus = (loading: boolean) => {
    dispatch({ type: "SET_LOADING", payload: loading });
  };

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
        setLoadingStatus(true);
        searchLoad(`/search/${mediaType}?searchTerm=${encodedSearchTerm}`);
      },
      1000
    );
  }, []);

  useEffect(() => {
    if (!state.searchTerm.trim() || !state.mediaType) {
      setLoadingStatus(false);
      debouncedSearch.cancel();
      return;
    }

    if (state.searchTerm.trim() && state.mediaType) {
      !state.isLoading && dispatch({ type: "SET_LOADING", payload: true });
      debouncedSearch({
        mediaType: state.mediaType,
        searchTerm: state.searchTerm.trim(),
      });
    }
  }, [state.searchTerm]);

  return {
    mediaType: state.mediaType,
    setMediaType,
    searchTerm: state.searchTerm,
    search: setSearchTerm,
    results: searchData,
    isLoading: state.isLoading || searchState !== "idle",
  };
}
