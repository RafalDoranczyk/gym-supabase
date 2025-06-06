"use server";

import { assertZodParse, getUserScopedQuery, mapSupabaseErrorToAppError } from "@/utils";
import {
  userPreferencesDefaultValues,
  UserPreferencesSchema,
  type FetchUserPreferencesResponse,
} from "@repo/schemas";

export async function fetchUserPreferences(): Promise<FetchUserPreferencesResponse> {
  const { user, supabase } = await getUserScopedQuery();

  const { data, error } = await supabase
    .from("user_preferences")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error) {
    // If no preferences exist yet, create them with defaults
    if (error.code === "PGRST116") {
      // Try to create default preferences
      const { data: newData, error: createError } = await supabase
        .from("user_preferences")
        .insert({ user_id: user.id, ...userPreferencesDefaultValues })
        .select("*")
        .single();

      if (createError) {
        throw mapSupabaseErrorToAppError(createError);
      }

      return assertZodParse(UserPreferencesSchema, newData);
    }

    throw mapSupabaseErrorToAppError(error);
  }

  return assertZodParse(UserPreferencesSchema, data);
}
