import { UserIcon } from "@heroicons/react/24/outline";
import { Form, useSubmit } from "@remix-run/react";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  unstable_composeUploadHandlers,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
} from "@vercel/remix";
import { useEffect, useRef, useState } from "react";
import invariant from "tiny-invariant";
import Spinner from "~/components/spinner";
import { db } from "~/db.server";
import { useUserContext } from "~/features/v2/auth/context";
import { getServerClient } from "~/features/v2/auth/client.server";
import { getUserOrRedirect } from "~/features/v2/auth/user.server";
import asyncIterableToStream from "~/utils/asyncIterableToStream";
import { useOptimisticParams } from "~/utils/useOptimisticParams";

export async function loader({ request }: LoaderFunctionArgs) {
  const response = new Response();
  await getUserOrRedirect({ request, response });
  return json(null, { headers: response.headers });
}

export async function action({ request }: ActionFunctionArgs) {
  const response = new Response();
  const supabaseClient = getServerClient({ request, response });
  const user = await getUserOrRedirect({ request, response });

  const uploadHandler = unstable_composeUploadHandlers(async (file) => {
    if (file.name !== "files") {
      return undefined;
    }

    const fileType = file.filename?.split(".").at(-1);
    invariant(fileType, "file type not found");

    const stream = asyncIterableToStream(file.data);
    const fileName = `${user.id}.${fileType}?timestamp=${Date.now()}`;

    const { data, error } = await supabaseClient.storage
      .from("public")
      .upload(`avatars/${fileName}`, stream, {
        contentType: file.contentType,
        upsert: true,
      });

    if (error) {
      throw new Error("Error uploading file");
    }

    await db.user.update({
      where: { id: user.id },
      data: { avatar: fileName },
    });
  }, unstable_createMemoryUploadHandler());

  try {
    await unstable_parseMultipartFormData(request, uploadHandler);
  } catch (e) {
    return { success: false as const, error: e };
  }

  return { success: true as const };
}

export default function Profile() {
  const submit = useSubmit();
  const user = useUserContext();
  const ref = useRef<HTMLInputElement>(null);
  const { isLoading, getParam } = useOptimisticParams();

  const onAvatarChange = (e: React.FormEvent<HTMLFormElement>) => {
    submit(e.currentTarget, {
      method: "post",
      encType: "multipart/form-data",
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold mb-2">Avatar</h2>
      <div className="flex flex-col items-center gap-4">
        <div className="w-56 h-56 rounded-full overflow-hidden border-2 border-primary-800">
          {user?.avatar ? (
            <img className="w-full h-full" src={user.avatar ?? undefined} />
          ) : (
            <UserIcon className="w-full h-full" />
          )}
        </div>

        <Form onChange={onAvatarChange}>
          <button
            name="actionId"
            value="avatar"
            type="button"
            onClick={() => ref.current?.click()}
            className="flex items-center justify-center text-sm bg-primary-800 active:bg-primary-600 hover:bg-primary-700 py-2 text-slate-50 rounded w-40"
          >
            {isLoading && getParam("files") ? (
              <Spinner className="h-5 w-5 self-center" />
            ) : (
              "Replace"
            )}
          </button>

          <input ref={ref} className="hidden" name="files" type="file" />
        </Form>
      </div>
    </div>
  );
}
