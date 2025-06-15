"use server";

import { createSupabase, mapSupabaseErrorToAppError } from "@/core/supabase";

export async function updateUserOnboardingStatus(completed: boolean) {
  try {
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
  } catch (error) {
    console.error("Failed to update onboarding status:", error);
    throw error;
  }
}

export async function getUserOnboardingStatus() {
  try {
    const supabase = await createSupabase();

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      throw mapSupabaseErrorToAppError(error);
    }

    return user?.user_metadata?.onboarding_completed;
  } catch (error) {
    console.error("Failed to get onboarding status:", error);
    throw error;
  }
}
