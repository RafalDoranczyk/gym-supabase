import { getUser } from "@/actions";
import { createServerClient } from "./createServerClient";

export async function getUserScopedQuery() {
  const user = await getUser();
  const supabase = await createServerClient();
  return { user, supabase };
}
