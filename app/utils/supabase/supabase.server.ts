import { createServerClient } from "@supabase/auth-helpers-remix";
import { type Database } from "types/supabaseSchema";

export type RequestResponse = {
  request: Request;
  response: Response;
};

let url = process.env.SUPABASE_URL as string;
let anonKey = process.env.SUPABASE_ANON_KEY as string;

export function createSupabaseClient({ request, response }: RequestResponse) {
  const supabaseClient = createServerClient<Database>(url, anonKey, {
    request,
    response,
  });

  return supabaseClient;
}
