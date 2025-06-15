import { getUserScopedQuery, mapSupabaseErrorToAppError } from "@/core/supabase";
import { assertZodParse } from "@/utils";
import { FetchUserSettingsResponseSchema } from "../schemas";

export async function fetchUserSettings() {
  const { supabase, user } = await getUserScopedQuery();

  const { data, error } = await supabase
    .from("user_settings")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    throw mapSupabaseErrorToAppError(error);
  }

  return assertZodParse(FetchUserSettingsResponseSchema, data);
}
