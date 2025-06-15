import { getUserScopedQuery } from "@/core/supabase";

export async function fetchUserSettings() {
  const { supabase, user } = await getUserScopedQuery();

  const { data, error } = await supabase
    .from("user_settings")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) throw error;
  return data;
}
