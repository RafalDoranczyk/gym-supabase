"use server";

import { createSupabase, getUserScopedQuery, mapSupabaseErrorToAppError } from "@/core/supabase";
import { assertZodParse } from "@/utils";
import {
  UpdateUserSettingsPayloadSchema,
  UserSettingsSchema,
  type UpdateUserSettingsPayload,
} from "../schemas";

export async function updateUserSettings(payload: UpdateUserSettingsPayload) {
  const { supabase, user } = await getUserScopedQuery();
  const validatedPayload = assertZodParse(UpdateUserSettingsPayloadSchema, payload);

  const { data, error } = await supabase
    .from("user_settings")
    .update({
      ...validatedPayload,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id)
    .select()
    .single();

  if (error) {
    throw mapSupabaseErrorToAppError(error);
  }

  return assertZodParse(UserSettingsSchema, data);
}

// Specific helpers
export async function markOnboardingComplete() {
  return updateUserSettings({
    onboarding_completed: true,
    onboarding_completed_at: new Date().toISOString(),
  });
}

export async function updateUserOnboardingStatus(completed: boolean) {
  const supabase = await createSupabase();

  const { data, error } = await supabase.auth.updateUser({
    data: {
      onboarding_completed: completed,
      onboarding_completed_at: new Date().toISOString(),
    },
  });

  if (error) {
    throw mapSupabaseErrorToAppError(error);
  }

  return data;
}
