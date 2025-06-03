"use server";

import { getUserScopedQuery, mapSupabaseErrorToAppError } from "@/utils";

export async function deleteMeasurement(id: string): Promise<void> {
  const { user, supabase } = await getUserScopedQuery();

  // Delete measurement (only if it belongs to the user)
  const { error } = await supabase
    .from("measurements")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id); // Ensure user can only delete their own measurements

  if (error) {
    throw mapSupabaseErrorToAppError(error);
  }
}

// Bulk delete measurements
export async function deleteMeasurements(ids: string[]): Promise<void> {
  const { user, supabase } = await getUserScopedQuery();

  if (ids.length === 0) {
    throw new Error("At least one ID is required for bulk delete");
  }

  // Delete measurements (only if they belong to the user)
  const { error } = await supabase
    .from("measurements")
    .delete()
    .in("id", ids)
    .eq("user_id", user.id); // Ensure user can only delete their own measurements

  if (error) {
    throw mapSupabaseErrorToAppError(error);
  }
}
