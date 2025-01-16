import { createClient } from "@supabase/supabase-js";

export function createSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_DATABASE_URI as string,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_KEY as string
  );
}
