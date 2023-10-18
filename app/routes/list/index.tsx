import { LoaderFunctionArgs } from "@vercel/remix";
import { redirect } from "@vercel/remix";
import { getUserDetails } from "~/features/auth/auth.server";

import { createSupabaseClient } from "~/utils/supabase";

export async function loader({ request }: LoaderFunctionArgs) {
  const response = new Response();
  const supabaseClient = createSupabaseClient({ request, response });
  const user = await supabaseClient.auth.getUser();

  if (!user?.data?.user?.id)
    throw redirect("/login", { headers: response.headers });

  const { username } = await getUserDetails(user.data.user.id);
  throw redirect(`$/{usermame}`, { headers: response.headers });
}
