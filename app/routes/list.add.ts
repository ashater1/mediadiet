import { ActionFunctionArgs, json, redirect } from "@vercel/remix";
import { NewBookSchema } from "~/features/add/types";
import { getUserOrRedirect } from "~/features/auth/auth.server";

import { deleteSavedBook } from "~/features/saved/delete";
import { setToast } from "~/features/toasts/toast.server";
import { convertStringToBool } from "~/utils/funcs";

export async function action({ request }: ActionFunctionArgs) {}
