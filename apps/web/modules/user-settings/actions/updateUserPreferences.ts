"use server";

import { assertZodParse, getUserScopedQuery, mapSupabaseErrorToAppError } from "@/utils";
import {
  UpdateUserPreferencesPayloadSchema,
  UserPreferencesSchema,
  type UpdateUserPreferencesPayload,
  type UserPreferences,
} from "@repo/schemas";
import { revalidatePath } from "next/cache";

export async function updateUserPreferences(
  payload: UpdateUserPreferencesPayload
): Promise<UserPreferences> {
  const validatedPayload = assertZodParse(UpdateUserPreferencesPayloadSchema, payload);
  const { user, supabase } = await getUserScopedQuery();

  const { data, error } = await supabase
    .from("user_preferences")
    .update(validatedPayload)
    .eq("user_id", user.id)
    .select("*")
    .single();

  if (error) {
    throw mapSupabaseErrorToAppError(error);
  }

  revalidatePath("/dashboard/settings");

  return assertZodParse(UserPreferencesSchema, data);
}
