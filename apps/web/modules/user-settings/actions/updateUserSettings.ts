"use server";

import { getUserScopedQuery } from "@/core/supabase";

export async function updateUserSettings(updates: {
  onboarding_completed?: boolean;
  onboarding_completed_at?: string;
}) {
  const { supabase, user } = await getUserScopedQuery();

  const { data, error } = await supabase
    .from("user_settings")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Specific helpers
export async function markOnboardingComplete() {
  return updateUserSettings({
    onboarding_completed: true,
    onboarding_completed_at: new Date().toISOString(),
  });
}
