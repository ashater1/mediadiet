import {
  Form,
  Link,
  useMatches,
  useNavigation,
  useParams,
} from "@remix-run/react";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  SerializeFrom,
  json,
  redirect,
} from "@vercel/remix";

import invariant from "tiny-invariant";
import { z } from "zod";
import { Button } from "~/components/button";
import { Spinner } from "~/components/login/Spinner";
import {
  EntryFormHeader,
  EntryFormImage,
  EntryFormImageRoot,
  EntryFormInputs,
  EntryFormRoot,
} from "~/features/add/components/entryForm";
import {
  NewBookSchema,
  NewMovieSchema,
  NewTvSchema,
} from "~/features/add/types";
import { getUserDetails } from "~/features/auth/auth.server";
import { updateEntry } from "~/features/list/db/entry";
import { deleteEntry } from "~/features/v2/list/delete.server";

import { loader as reviewLoader } from "~/routes/$username.$reviewId";
import { convertStringToBool, safeFilter } from "~/utils/funcs";

const UpdateBookSchema = NewBookSchema.omit({
  id: true,
});

const UpdateMovieSchema = NewMovieSchema.omit({
  id: true,
});

const UpdateTvSchema = NewTvSchema.omit({
  id: true,
  seasonId: true,
});

export const UpdateSchema = z.union([
  UpdateBookSchema.merge(
    z.object({ reviewId: z.string(), mediaType: z.literal("book") })
  ),

  UpdateMovieSchema.merge(
    z.object({ reviewId: z.string(), mediaType: z.literal("movie") })
  ),

  UpdateTvSchema.merge(
    z.object({ reviewId: z.string(), mediaType: z.literal("tv") })
  ),
]);

const DeleteSchema = z.object({
  reviewId: z.string(),
  mediaType: z.union([z.literal("book"), z.literal("movie"), z.literal("tv")]),
});

export type UpdateSchemaType = z.infer<typeof UpdateSchema>;

export async function loader({ request, params }: LoaderFunctionArgs) {
  const response = new Response();
  const user = await getUserDetails({ request, response });

  const username = params.username;
  const reviewId = params.reviewId;

  invariant(username, "userId is required");
  invariant(reviewId, "reviewId is required");

  const isAuthed = !!user;
  const isSelf = isAuthed && user.username === username;
  if (!isSelf) throw redirect(`/${username}/${reviewId}`);
  return json(null, { headers: response.headers });
}

export async function action({ params, request }: ActionFunctionArgs) {
  const { username, reviewId } = params;
  invariant(username, "The username is required");
  invariant(reviewId, "The reviewId is required");

  const submission = Object.fromEntries(await request.formData());

  if (submission.intent === "delete") {
    const data = DeleteSchema.parse(submission);
    await deleteEntry(data.reviewId);
    throw redirect(`/${username}`);
  }

  if (submission.intent === "update") {
    const favorited = convertStringToBool(submission.favorited);

    const data = UpdateSchema.parse({ ...submission, favorited });
    await updateEntry({ ...data, reviewId });
    throw redirect(`/${username}/${reviewId}`);
  }

  throw new Error("Invalid intent");
}

export default function Edit() {
  const matches = useMatches();
  const entry = matches.at(-2)?.data as SerializeFrom<typeof reviewLoader>;

  const params = useParams();
  const navigation = useNavigation();

  const updating =
    navigation.state !== "idle" &&
    navigation.formData?.get("intent") === "update";

  const deleting =
    navigation.state !== "idle" &&
    navigation.formData?.get("intent") === "delete";

  const subHeaders = safeFilter([entry.creators, entry.releaseYear]);

  const hiddenInputs = [
    { name: "mediaType", value: entry.mediaType },
    { name: "reviewId", value: entry.id },
  ];

  return (
    <>
      <Link prefetch={"render"} to={`/${params.username}/${params.reviewId}`}>
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-lg" />
      </Link>

      <div className="left-1/2 top-1/2 z-50 w-full max-w-2xl fixed -translate-x-1/2 -translate-y-1/2 rounded bg-gradient-to-tr from-orange-100 via-pink-100 to-indigo-50 p-4 md:w-auto">
        <div>
          <EntryFormRoot>
            <EntryFormImageRoot>
              {entry.img && <EntryFormImage src={entry.img} />}
            </EntryFormImageRoot>
            <div className="flex h-full w-full flex-col">
              <div className="flex items-start justify-between">
                <div className="flex flex-col">
                  <EntryFormHeader
                    title={entry.title}
                    subHeaders={subHeaders}
                  />
                </div>
              </div>

              <Form className="mt-4 flex h-full flex-col gap-4" method="post">
                <EntryFormInputs
                  audiobook={"audiobook" in entry && entry.audiobook}
                  isOnPlane={("onPlane" in entry && entry.onPlane) ?? false}
                  isInTheater={
                    ("inTheater" in entry && entry.inTheater) ?? false
                  }
                  hiddenInputs={hiddenInputs}
                  consumedDate={entry.utcDate}
                  favorited={entry.favorited ?? false}
                  mediaType={entry.mediaType}
                  review={entry.review ?? undefined}
                  stars={entry.stars ?? null}
                />
                <div className="flex gap-3">
                  <Button
                    name="intent"
                    value="update"
                    type="submit"
                    className="w-full"
                  >
                    {updating ? <Spinner diameter={4} /> : "Submit"}
                  </Button>
                </div>
              </Form>
            </div>
          </EntryFormRoot>
        </div>
      </div>
    </>
  );
}
