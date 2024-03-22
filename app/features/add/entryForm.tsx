import { Menu } from "@headlessui/react";
import { ArrowLeftCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { useFetcher } from "@remix-run/react";
import { useEffect } from "react";
import { Spinner } from "~/components/login/Spinner";
import { action as addNewEntryAction } from "~/routes/list.add";
import { safeFilter } from "~/utils/funcs";
import {
  EntryFormHeader,
  EntryFormImage,
  EntryFormImageRoot,
  EntryFormInputs,
  EntryFormRoot,
} from "./components/entryForm";
import { useAddNewContext } from "./context";
import { Button } from "~/components/button";
import { MediaType } from "@prisma/client";

type NewEntryFormProps = {
  id: string;
  imgSrc?: string | null;
  title?: string | null;
  creators?: string | null;
  releaseYear?: string | null;
  length?: string | null;
  mediaType: MediaType;
  hiddenIds?: HiddenId[] | null;
};

type HiddenId = { name: string; value: string };

export function TVForm() {
  const {
    state: addingState,
    data: addSuccess,
    Form,
  } = useFetcher<typeof addNewEntryAction>();

  const {
    state: { selectedItem, selectedSeason },
    mediaItemData,
    setSeason,
    resetSelectedItem,
    resetSeason,
    closeModal,
  } = useAddNewContext();

  if (mediaItemData?.mediaType !== "tv") {
    throw new Error("mediaItemData.mediaType must be tv");
  }

  const isDone = addingState === "idle" && addSuccess?.success;

  useEffect(() => {
    if (isDone) closeModal({ type: "success" });
  }, [isDone]);

  if (!selectedSeason) {
    const subHeaders = safeFilter([
      mediaItemData?.creator,
      mediaItemData?.releaseDate,
      mediaItemData?.seasons.length
        ? `${mediaItemData?.seasons.length} seasons`
        : null,
    ]);

    return (
      <div className="relative">
        <EntryFormHeaderBar
          onBackClick={resetSelectedItem}
          onCloseClick={() => closeModal({ type: "default" })}
        />
        <EntryFormRoot className="p-5">
          <EntryFormImageRoot>
            {mediaItemData?.posterPath && (
              <EntryFormImage
                src={`https://image.tmdb.org/t/p/w500${mediaItemData?.posterPath}`}
              />
            )}
          </EntryFormImageRoot>

          <div className="flex h-full w-full flex-col">
            <EntryFormHeader
              title={mediaItemData?.title}
              subHeaders={subHeaders}
            />

            <Menu>
              <Menu.Items
                static
                className="mt-2 flex flex-col overflow-y-auto rounded border-2 border-transparent outline-none ring-0 focus-within:shadow-md"
              >
                {mediaItemData?.seasons.map((season) => (
                  <Menu.Item
                    onClick={() => setSeason(String(season.id))}
                    as="button"
                    className="flex items-center overflow-x-visible rounded px-2 py-2 outline-none ring-0 ui-active:bg-white/20 ui-active:text-white"
                  >
                    <>
                      <div className="font-light">
                        {season.name ?? `Season ${season.season_number}`}
                      </div>
                      <div className="ml-4 flex items-center gap-1">
                        <div className="text-xs">
                          {season.air_date?.slice(0, 4)}
                        </div>
                        <span>&#x2022;</span>
                        <div className="text-xs">{`${season.episode_count} episodes`}</div>
                      </div>
                    </>
                  </Menu.Item>
                ))}
              </Menu.Items>
            </Menu>
          </div>
        </EntryFormRoot>
      </div>
    );
  }

  const selectedSeasonData = mediaItemData?.seasons.find(
    ({ id }) => String(id) === selectedSeason
  );

  if (!selectedSeasonData) throw new Error("Season not found");

  return (
    <div className="relative">
      <EntryFormHeaderBar
        onBackClick={resetSeason}
        onCloseClick={() => closeModal({ type: "default" })}
      />
      <NewEntryForm
        creators={mediaItemData?.creator}
        hiddenIds={[{ name: "seasonId", value: selectedSeasonData.id }]}
        id={selectedItem ?? ""}
        imgSrc={`https://image.tmdb.org/t/p/w500${selectedSeasonData.poster_path}`}
        length={`${selectedSeasonData.episode_count} episodes`}
        mediaType="TV"
        releaseYear={selectedSeasonData.air_date?.slice(0, 4)}
        title={`${mediaItemData?.title} - Season ${selectedSeasonData.season_number}`}
      />
    </div>
  );
}

export function ReviewForm() {
  const { searchData, state, mediaItemData, resetSelectedItem, closeModal } =
    useAddNewContext();

  if (!mediaItemData)
    throw new Error(
      "Only render this component when mediaItemData is available"
    );

  if (mediaItemData?.mediaType === "tv") return <TVForm />;

  if (mediaItemData?.mediaType === "BOOK") {
    return (
      <div className="relative">
        <EntryFormHeaderBar
          onBackClick={resetSelectedItem}
          onCloseClick={() => closeModal({ type: "default" })}
        />
        <NewEntryForm
          hiddenIds={[
            {
              name: "firstPublishedYear",
              value: mediaItemData.releaseYear as string,
            },
          ]}
          id={state.selectedItem ?? ""}
          imgSrc={mediaItemData.imgSrc}
          title={mediaItemData.title}
          creators={mediaItemData.creators}
          releaseYear={mediaItemData.releaseYear}
          length={mediaItemData.length}
          mediaType={mediaItemData.mediaType}
        />
      </div>
    );
  }

  return (
    <div className="relative">
      <EntryFormHeaderBar
        onBackClick={resetSelectedItem}
        onCloseClick={() => closeModal({ type: "default" })}
      />
      <NewEntryForm
        id={state.selectedItem ?? ""}
        imgSrc={mediaItemData.imgSrc}
        title={mediaItemData.title}
        creators={mediaItemData.creators}
        releaseYear={mediaItemData.releaseYear}
        length={mediaItemData.length}
        mediaType={mediaItemData.mediaType}
      />
    </div>
  );
}

export function NewEntryForm({
  id,
  imgSrc,
  title,
  hiddenIds,
  creators,
  releaseYear,
  length,
  mediaType,
}: NewEntryFormProps) {
  const { closeModal } = useAddNewContext();

  const {
    state: addingState,
    data: addSuccess,
    Form,
  } = useFetcher<typeof addNewEntryAction>();

  const loading = addingState !== "idle" || addSuccess?.success;
  const success = addingState === "idle" && addSuccess?.success;

  if (success) {
    closeModal({ type: "success" });
  }

  const subHeaders = safeFilter([creators, releaseYear, length]);

  return (
    <EntryFormRoot className="p-5">
      <EntryFormImageRoot>
        {imgSrc && <EntryFormImage src={imgSrc} />}
      </EntryFormImageRoot>

      <div className="flex h-full w-full flex-col">
        <EntryFormHeader title={title} subHeaders={subHeaders} />

        <Form
          className="mt-2 flex h-full flex-col gap-4"
          method="post"
          action={`/list/${mediaType}/add`}
        >
          <EntryFormInputs
            hiddenInputs={[...(hiddenIds ?? []), { name: "id", value: id }]}
            mediaType={mediaType}
          />
          <Button className="py-4" type="submit">
            {loading ? <Spinner diameter={4} /> : "Submit"}
          </Button>
        </Form>
      </div>
    </EntryFormRoot>
  );
}

function EntryFormHeaderBar({
  onBackClick,
  onCloseClick,
}: {
  onBackClick: () => void;
  onCloseClick: () => void;
}) {
  return (
    <div className="absolute left-0 top-0 z-10 flex w-full px-1 py-1 md:px-2">
      <button className="group" type="button" onClick={onBackClick}>
        <ArrowLeftCircleIcon className="active: h-6 w-6 fill-gray-50 stroke-gray-700 stroke-1 hover:fill-gray-100 active:fill-gray-200" />
      </button>

      <button type="button" className="group ml-auto" onClick={onCloseClick}>
        <XCircleIcon className="active: h-6 w-6 fill-gray-50 stroke-gray-700 stroke-1 hover:fill-gray-100 active:fill-gray-200" />
      </button>
    </div>
  );
}
