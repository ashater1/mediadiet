import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import {
  Link,
  Outlet,
  useLoaderData,
  useNavigation,
  useParams,
  useSubmit,
} from "@remix-run/react";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from "@vercel/remix";
import classNames from "classnames";
import invariant from "tiny-invariant";
import { Spinner } from "~/components/login/Spinner";
import { getUserDetails } from "~/features/auth/auth.server";
import { FavoriteHeart, StarsDisplay } from "~/features/list/icons/icons";

import { setToast } from "~/features/toasts/toast.server";
import { deleteEntry } from "~/features/v2/list/delete.server";
import { getEntry } from "~/features/v2/list/entries.server";
import { useListOwnerContext } from "~/features/v2/list/useListOwnerContext";

export async function loader({ params }: LoaderFunctionArgs) {
  const response = new Response();
  const username = params.username;
  const reviewId = params.reviewId;

  invariant(username, "No username provided");
  invariant(reviewId, "No review ID provided");

  const review = await getEntry({ id: reviewId });

  if (!review) {
    throw new Response(null, { status: 404, statusText: "Review not found" });
  }

  return json(review, { headers: response.headers });
}

export async function action({ params, request }: ActionFunctionArgs) {
  const username = params.username;
  invariant(username, "No username provided");

  const reviewId = params.reviewId;
  invariant(reviewId, "No review ID provided");

  const response = new Response();
  const user = await getUserDetails({ request, response });
  const isAuthed = !!user;
  const isSelf = isAuthed && user.username === username;

  // TODO - update isSelf logic & throw correct status if someone who isn't the user tries to delete
  if (!isAuthed || !isSelf) {
    throw redirect("/login", {
      headers: response.headers,
    });
  }

  let result = await deleteEntry({ id: reviewId, userId: user.id });

  if (result?.success) {
    await setToast({
      request,
      response,
      toast: {
        type: "deleted",
        title: `Deleted your review of ${result.title}`,
      },
    });
  } else {
    await setToast({
      request,
      response,
      toast: {
        type: "error",
        title: `There was an issue trying to delete your review, try again later.`,
      },
    });
  }

  throw redirect(`/${username}`, {
    headers: response.headers,
  });
}

export default function Review() {
  const review = useLoaderData<typeof loader>();
  const { listOwner, isSelf } = useListOwnerContext();

  const params = useParams();
  const submit = useSubmit();
  const navigation = useNavigation();

  const deleting =
    navigation.state !== "idle" &&
    navigation.formData?.get("intent") === "delete";

  const handleDelete = () => {
    submit({ intent: "delete" }, { method: "post" });
  };

  return (
    <>
      <div className="w-full">
        <div className="mt-4 flex gap-10">
          <div className="hidden w-80 rounded md:block">
            <img
              src={review.mediaItem.coverArt ?? ""}
              className="h-auto w-full rounded shadow-lg"
            />
          </div>

          <div className="flex w-full flex-col">
            <div className="flex items-center gap-3">
              <img
                className="h-10 w-10 rounded-full"
                src={listOwner.avatar ?? undefined}
              />

              <div className="flex flex-col text-sm gap-0.5">
                <Link to={`/${params.username}`}>Reviewed by Adam Shater</Link>
                <p className="text-gray-500">
                  {review.mediaItem.mediaType === "MOVIE"
                    ? "Watched on "
                    : review.mediaItem.mediaType === "TV"
                    ? "Finished watching on "
                    : "Finished reading on "}
                  {review.formattedConsumedDate}
                </p>
              </div>

              {isSelf && (
                <div className="ml-auto flex items-center justify-center gap-2">
                  <button
                    disabled={deleting}
                    onClick={handleDelete}
                    className={classNames(
                      deleting
                        ? "animate-pulse opacity-50"
                        : "hover:opacity-100 ",
                      "flex items-center justify-center gap-2 rounded border border-gray-200 bg-gray-100 p-2 text-sm text-gray-800 opacity-75 hover:text-red-500 md:px-3 md:py-1"
                    )}
                  >
                    {deleting ? (
                      <Spinner diameter={5} />
                    ) : (
                      <>
                        <TrashIcon className="h-6 w-6 md:h-4 md:w-4" />
                        <span className="hidden md:block text-xs">Delete</span>
                      </>
                    )}
                  </button>

                  <Link
                    to="edit"
                    className="flex items-center justify-center gap-2 rounded border border-gray-200 bg-gray-100 p-2 text-sm text-gray-800 opacity-75 hover:text-blue-500 md:px-3 md:py-1"
                  >
                    <PencilSquareIcon className="h-6 w-6 md:h-4 md:w-4" />
                    <span className="hidden md:inline-block text-xs">Edit</span>
                  </Link>
                </div>
              )}
            </div>

            <div className="mb-4 mt-2 border-b border-gray-200" />

            <div className="group flex w-full flex-col">
              <div className="flex w-full items-center">
                <h2 className="min-w-0 text-lg font-semibold text-gray-900 line-clamp-2 md:text-lg">
                  {review.mediaItem.title}
                </h2>

                <div className="ml-auto flex items-center">
                  {review.stars && <StarsDisplay stars={review.stars} />}

                  <div className="px-4">
                    {review.favorited && <FavoriteHeart isOn />}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>{review.mediaItem.creator}</span>
                {review.mediaItem.creator && review.mediaItem.releaseYear && (
                  <span>•</span>
                )}
                <span>{review.mediaItem.releaseYear}</span>
              </div>
              <div className="mt-5">
                <p className="mt-1 text-sm leading-5">{review.review}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Outlet />
    </>
  );
}
