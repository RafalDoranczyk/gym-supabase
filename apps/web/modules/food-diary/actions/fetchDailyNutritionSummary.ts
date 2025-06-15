import { mapSupabaseErrorToAppError } from "@/core/supabase";
import type { DailyNutritionSummary } from "@repo/schemas";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function fetchDailyNutritionSummary(
  supabase: SupabaseClient,
  userId: string,
  entryDate: string
): Promise<DailyNutritionSummary | null> {
  const { data: dailySummary, error: dailyError } = await supabase
    .from("daily_nutrition_summary")
    .select("*")
    .eq("user_id", userId)
    .eq("entry_date", entryDate)
    .single();

  // PGRST116 = no rows found, which is fine for empty days
  if (dailyError && dailyError.code !== "PGRST116") {
    throw mapSupabaseErrorToAppError(dailyError);
  }

  return dailySummary || null;
}
