"use server";

import { createServerClient as supabaseServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createSupabaseServer(url: string, key: string) {
  const cookieStore = await cookies();

  return supabaseServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, options, value } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Server Component - can be ignored if middleware refreshes sessions
        }
      },
    },
  });
}
