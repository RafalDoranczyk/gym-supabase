import { getUserScopedQuery, mapSupabaseErrorToAppError } from "@/core/supabase";
import { assertZodParse } from "@/utils";
import { NutritionGoalsSchema, type FetchNutritionGoalsResponse } from "../schemas";

export async function fetchNutritionGoals(): Promise<FetchNutritionGoalsResponse> {
  const { supabase, user } = await getUserScopedQuery();

  const { data, error } = await supabase
    .from("fitness_goals")
    .select("*")
    .eq("user_id", user.id)
    .single();

  // Handle case where user has no nutrition goals yet
  if (error && error.code === "PGRST116") {
    return null; // No rows found - user hasn't set up nutrition goals yet
  }

  if (error) {
    throw mapSupabaseErrorToAppError(error);
  }

  return assertZodParse(NutritionGoalsSchema, data);
}
