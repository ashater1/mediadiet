import { useFetcher } from "@remix-run/react";
import { useEffect, useReducer, useState } from "react";
import { loader as bookLoader } from "~/routes/search.book.$id";
import { loader as movieLoader } from "~/routes/search.movie.$id";
import { loader as tvLoader } from "~/routes/search.tv.$id";

import { SerializeFrom } from "@vercel/remix";
import { useSearch } from "../v2/search/useSearch";
import { MediaType } from "@prisma/client";

type ModalCloses = "default" | "success" | "draft";

type State = {
  isSearchLoading: boolean;
  searchTerm: string;
  mediaType: MediaType;
  selectedItem: string | null;
  selectedSeason: string | null;
  isModalOpen: boolean;
};

type Action =
  | { type: "SET_MEDIA_TYPE"; payload: MediaType }
  | {
      type: "SET_SEARCH_TERM";
      payload: string;
    }
  | { type: "SET_LOADING"; payload: boolean }
  | {
      type: "SET_SELECTED_ITEM";
      payload: string;
    }
  | { type: "RESET_SELECTED_ITEM" }
  | {
      type: "SET_SEASON";
      payload: string;
    }
  | { type: "RESET_SEASON" }
  | {
      type: "CLOSE_MODAL";
      closeType: ModalCloses;
    }
  | {
      type: "OPEN_MODAL";
    };

const initialState: State = {
  isModalOpen: false,
  selectedSeason: null,
  selectedItem: null,
  isSearchLoading: false,
  mediaType: MediaType.MOVIE,
  searchTerm: "",
};

function reducer(state: State, action: Action) {
  switch (action.type) {
    case "SET_MEDIA_TYPE":
      return {
        ...state,
        mediaType: action.payload,
        searchTerm: "",
        loading: false,
      };

    case "SET_SEARCH_TERM": {
      return { ...state, searchTerm: action.payload, isSearchLoading: true };
    }

    case "SET_LOADING": {
      return { ...state, isSearchLoading: action.payload };
    }

    case "RESET_SELECTED_ITEM": {
      return {
        ...state,
        selectedItem: null,
      };
    }
    case "SET_SELECTED_ITEM": {
      return {
        ...state,
        selectedItem: action.payload,
      };
    }

    case "SET_SEASON": {
      return {
        ...state,
        selectedSeason: action.payload,
      };
    }

    case "RESET_SEASON": {
      return {
        ...state,
        selectedSeason: null,
      };
    }

    case "CLOSE_MODAL": {
      if (action.closeType === "success") {
        return {
          ...state,
          searchTerm: "",
          mediaType: "movie" as MediaType,
          selectedItem: null,
          selectedSeason: null,
          isModalOpen: false,
        };
      }

      return { ...state, isModalOpen: false };
    }

    case "OPEN_MODAL": {
      return { ...state, isModalOpen: true };
    }

    default:
      return { ...state };
  }
}

export function useAddNew() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    isLoading: isSearchLoading,
    mediaType,
    results: searchResults,
    search,
    searchTerm,
    setMediaType,
  } = useSearch();

  type Book = SerializeFrom<typeof bookLoader> & {
    imgSrc: string | null;
    releaseYear: string | null;
    length: string | null;
  };

  let {
    data: _mediaItemData,
    load: mediaItemLoad,
    state: mediaItemState,
  } = useFetcher<Book | typeof tvLoader | typeof movieLoader | null>();

  const [mediaItemData, setMediaItemData] = useState<
    typeof _mediaItemData | null
  >(null);

  useEffect(() => {
    if (_mediaItemData?.mediaType === "BOOK") {
      const bookInfo = searchResults?.data.filter(
        (i) => i.id === state.selectedItem
      )[0] as any;

      if (bookInfo)
        setMediaItemData({
          ..._mediaItemData,
          ...bookInfo,
          length: bookInfo.medianPages ? `${bookInfo.medianPages} pages` : null,
        });

      return;
    }

    setMediaItemData(_mediaItemData);
  }, [_mediaItemData]);

  const setSelectedItem = (id: string) => {
    dispatch({ type: "SET_SELECTED_ITEM", payload: id });
    mediaItemLoad(`/search/${state.mediaType}/${id}`);
  };

  const resetSelectedItem = () => {
    dispatch({ type: "RESET_SELECTED_ITEM" });
    setMediaItemData(null);
  };

  const setSeason = (seasonId: string) => {
    if (state.mediaType !== "TV")
      throw new Error("Can't set a season for movie or book");

    dispatch({ type: "SET_SEASON", payload: seasonId });
  };

  const resetSeason = () => {
    dispatch({ type: "RESET_SEASON" });
  };

  const closeModal = ({ type = "default" }: { type?: ModalCloses }) => {
    dispatch({ type: "CLOSE_MODAL", closeType: type });
  };

  const openModal = () => {
    dispatch({ type: "OPEN_MODAL" });
  };

  return {
    closeModal,
    isSearchLoading,
    mediaItemData,
    mediaItemState,
    mediaType,
    openModal,
    resetSeason,
    resetSelectedItem,
    searchData: searchResults,
    setMediaType,
    setSearchTerm: search,
    setSeason,
    setSelectedItem,
    searchTerm,
    state,
  };
}
