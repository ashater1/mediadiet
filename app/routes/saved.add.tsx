import { Link, useNavigation, useSubmit } from "@remix-run/react";
import { ActionFunctionArgs, redirect } from "@vercel/remix";
import { Spinner } from "~/components/login/Spinner";
import { SelectMediaType } from "~/features/add/SelectMediaType";
import { getUserDetails } from "~/features/auth/user.server";
import { setToast } from "~/features/toasts/toast.server";
import {
  AddToSavedSchema,
  addSavedBook,
  addSavedMovie,
  addSavedShow,
} from "~/features/saved/add.server";
import { useSearch } from "~/features/search/useSearch";
import { SearchCombobox } from "~/features/search/SearchCombobox";

export async function action({ request }: ActionFunctionArgs) {
  const response = new Response();
  const user = await getUserDetails({ request, response });
  if (!user) {
    throw redirect("/login", { headers: response.headers });
  }

  const formData = Object.fromEntries(await request.formData());
  const result = AddToSavedSchema.parse(formData);

  if (result.mediaType === "BOOK") {
    const savedBook = await addSavedBook({
      apiId: result.id,
      username: user.username,
      firstPublishedYear: result.releaseYear ?? null,
    });

    await setToast({
      request,
      response,
      toast: {
        type: "deleted",
        title: `${savedBook.title} was added to your Saved list`,
      },
    });
  } else if (result.mediaType === "MOVIE") {
    const savedMovie = await addSavedMovie({
      apiId: result.id,
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
  } else if (result.mediaType === "TV") {
    const savedTv = await addSavedShow({
      username: user.username,
      showId: result.id,
    });

    await setToast({
      request,
      response,
      toast: {
        type: "deleted",
        title: `${savedTv.title} was added to your Saved list`,
      },
    });
  }

  console.log("Should throw redirect!");

  throw redirect("/saved", {
    headers: response.headers,
  });
}

export default function Add() {
  const { isLoading, mediaType, results, searchTerm, search, setMediaType } =
    useSearch();

  const submit = useSubmit();
  const navigation = useNavigation();

  const handleSelect = (id: string) => {
    if (!mediaType) return;

    if (mediaType === "BOOK") {
      const matchedItem = results?.data.filter((d) => d.id === id)[0];

      submit(
        { id, mediaType, releaseYear: matchedItem?.releaseYear ?? "" },
        { method: "post" }
      );

      return;
    }

    submit({ id, mediaType }, { method: "post" });
  };

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
                  isSearchLoading={isLoading}
                  items={results}
                  mediaType={mediaType}
                  onInputChange={search}
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
