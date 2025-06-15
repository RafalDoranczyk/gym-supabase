import { mapSupabaseErrorToAppError } from "@/core/supabase";
import type { MealNutritionSummary } from "@repo/schemas";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function fetchMealSummaries(
  supabase: SupabaseClient,
  userId: string,
  entryDate: string
): Promise<MealNutritionSummary[]> {
  const { data: mealSummaries, error: summaryError } = await supabase
    .from("meal_nutrition_summary")
    .select("*")
    .eq("user_id", userId)
    .eq("entry_date", entryDate)
    .order("meal_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (summaryError) {
    throw mapSupabaseErrorToAppError(summaryError);
  }

  return mealSummaries || [];
}
