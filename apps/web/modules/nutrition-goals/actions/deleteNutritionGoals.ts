import { getUserScopedQuery, mapSupabaseErrorToAppError } from "@/core/supabase";

export async function deleteNutritionGoals(): Promise<void> {
  const { supabase, user } = await getUserScopedQuery();

  const { error } = await supabase.from("fitness_goals").delete().eq("user_id", user.id);

  if (error) {
    throw mapSupabaseErrorToAppError(error);
  }
}
