import { MediaType } from "@prisma/client";
import { Link, useFetcher, useNavigation, useSubmit } from "@remix-run/react";
import { ActionFunctionArgs, redirect } from "@vercel/remix";
import debounce from "lodash/debounce.js";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { Spinner } from "~/components/login/Spinner";
import { SelectMediaType } from "~/features/add/SelectMediaType";
import { getUserDetails } from "~/features/auth/auth.server";
import { SearchCombobox } from "~/features/search";
import { setToast } from "~/features/toasts/toast.server";
import { addSavedBook, addSavedMovie } from "~/features/v2/saved/add";
import { loader as bookSearchLoader } from "~/routes/search.book._index";
import { loader as movieSearchLoader } from "~/routes/search.movie._index";
import { loader as tvSearchLoader } from "~/routes/search.tv._index";

const AddToSavedSchema = z.object({
  id: z.string(),
  mediaType: z.enum(["movie", "tv", "book"]),
  releaseYear: z.string().nullish(),
});

export async function action({ request }: ActionFunctionArgs) {
  const response = new Response();
  const user = await getUserDetails({ request, response });
  if (!user) {
    throw redirect("/login", { headers: response.headers });
  }

  const formData = Object.fromEntries(await request.formData());
  const { id, mediaType, releaseYear } = AddToSavedSchema.parse(formData);

  if (mediaType === "book") {
    const savedBook = await addSavedBook({
      apiId: id,
      username: user.username,
      firstPublishedYear: releaseYear ?? null,
    });

    await setToast({
      request,
      response,
      toast: {
        type: "deleted",
        title: `${savedBook.title} was added to your Saved list`,
      },
    });
  }

  if (mediaType === "movie") {
    const savedMovie = await addSavedMovie({
      apiId: id,
      username: user.username,
    });

    await setToast({
      request,
      response,
      toast: {
        type: "deleted",
        title: `${savedMovie.title} was added to your Saved list`,
      },
    });
  }

  // TODO - add saved show

  throw redirect("/saved", {
    headers: response.headers,
  });
}

export default function Add() {
  const [mediaType, setMediaType] = useState<MediaType>("MOVIE");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const submit = useSubmit();
  const navigation = useNavigation();

  let {
    data: searchData,
    load: searchLoad,
    state: searchState,
  } = useFetcher<
    typeof bookSearchLoader | typeof tvSearchLoader | typeof movieSearchLoader
  >();

  const handleSelect = (id: string) => {
    if (!mediaType) return;

    if (mediaType === "BOOK") {
      const matchedItem = searchData?.data.filter((d) => d.id === id)[0];

      submit(
        { id, mediaType, releaseYear: matchedItem?.releaseYear ?? "" },
        { method: "post" }
      );

      return;
    }

    submit({ id, mediaType }, { method: "post" });
  };

  const debouncedSearch = useMemo(() => {
    return debounce(
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

  return (
    <>
      <Link prefetch={"render"} to={"/saved"}>
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-lg" />
      </Link>

      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded bg-gradient-to-tr from-orange-100 via-pink-100 to-indigo-50 md:w-auto">
        <div className="w-full p-6 md:w-[500px]">
          {navigation.state !== "idle" ? (
            <div className="flex items-center justify-center p-3">
              <Spinner diameter={7} />
            </div>
          ) : (
            <>
              <SelectMediaType mediaType={mediaType} onChange={setMediaType} />
              <div className="mt-4">
                <SearchCombobox
                  isSearchLoading={isLoading || searchState !== "idle"}
                  items={searchData}
                  mediaType={mediaType}
                  onInputChange={setSearchTerm}
                  onSelect={(item) => handleSelect(item.id)}
                  searchTerm={searchTerm}
                  selectedItem={"abc"}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
