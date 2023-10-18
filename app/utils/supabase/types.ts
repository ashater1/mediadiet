import { Database } from "types/supabaseSchema";

export type DbTable<
  T extends keyof Database["public"]["Tables"],
  K extends keyof Database["public"]["Tables"][T] = "Row"
> = Omit<Database["public"]["Tables"][T][K], "created_at">;

export type DbViews<T extends keyof Database["public"]["Views"]> =
  Database["public"]["Views"][T]["Row"];
