import { TrashIcon } from "@heroicons/react/24/outline";
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
import { db } from "~/db.server";
import {
  EntryFormHeader,
  EntryFormImage,
  EntryFormImageRoot,
  EntryFormInputs,
  EntryFormRoot,
} from "~/features/add/components/entryForm";

import { getSessionUser } from "~/features/v2/auth/user.server";
import { entrySchema, updateEntry } from "~/features/v2/list/update.server";
import { loader as reviewLoader } from "~/routes/$username.$reviewId";
import { safeFilter } from "~/utils/funcs";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const response = new Response();
  const user = await getSessionUser({ request, response });
  if (!user) {
    throw redirect("/login", { headers: response.headers });
  }
  return json(null, { headers: response.headers });
}

const submission = z.object({});

export async function action({ params, request }: ActionFunctionArgs) {
  const response = new Response();
  const { username, reviewId } = params;
  invariant(username, "username required");
  invariant(reviewId, "reviewId required");

  const user = await getSessionUser({ request, response });
  if (!user) throw redirect("/login", { headers: response.headers });

  const submission = Object.fromEntries(await request.formData());
  console.log(submission.consumedDate);
  const parsedSubmission = entrySchema.parse({ ...submission, id: reviewId });
  console.log(parsedSubmission);
  const result = await updateEntry(parsedSubmission);
  // throw redirect(`/${username}/${reviewId}`, { headers: response.headers });
  return null;
}

export default function Edit() {
  const matches = useMatches();
  const entry = matches.at(-2)?.data as SerializeFrom<typeof reviewLoader>;
  const params = useParams();
  const navigation = useNavigation();

  const updating = navigation.state !== "idle";

  const subHeaders = safeFilter([
    entry.mediaItem.creator,
    String(entry.mediaItem.releaseYear),
  ]);

  const hiddenInputs = [{ name: "reviewId", value: entry.id }];

  return (
    <>
      <Link prefetch={"render"} to={`/${params.username}/${params.reviewId}`}>
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-lg" />
      </Link>

      <div className="left-1/2 top-1/2 z-50 w-full max-w-2xl fixed -translate-x-1/2 -translate-y-1/2 rounded bg-gradient-to-tr from-orange-100 via-pink-100 to-indigo-50 p-4 md:w-auto">
        <div>
          <EntryFormRoot>
            <EntryFormImageRoot>
              {entry.mediaItem.coverArt && (
                <EntryFormImage src={entry.mediaItem.coverArt} />
              )}
            </EntryFormImageRoot>
            <div className="flex h-full w-full flex-col">
              <div className="flex items-center justify-between">
                <div className="flex flex-col w-full">
                  <EntryFormHeader
                    title={entry.mediaItem.title}
                    subHeaders={subHeaders}
                  />
                </div>
              </div>

              <Form className="mt-4 flex h-full flex-col gap-4" method="post">
                <EntryFormInputs
                  audiobook={entry.audiobook}
                  isOnPlane={entry.onPlane ?? false}
                  isInTheater={
                    ("inTheater" in entry && entry.inTheater) ?? false
                  }
                  hiddenInputs={hiddenInputs}
                  consumedDate={entry.consumedDate}
                  favorited={entry.favorited ?? false}
                  mediaType={entry.mediaItem.mediaType}
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
