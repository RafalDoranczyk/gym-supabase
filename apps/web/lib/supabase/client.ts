import { createBrowserClient } from "@supabase/ssr";

export function createSupabaseClient(url: string, key: string) {
  return createBrowserClient(url, key);
}
