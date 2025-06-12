// utils/fetchMealIngredients.ts
import { mapSupabaseErrorToAppError } from "@/utils";
import type { FoodDiaryIngredient, MealNutritionSummary } from "@repo/schemas";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function fetchMealIngredients(
  supabase: SupabaseClient,
  mealSummaries: MealNutritionSummary[]
): Promise<FoodDiaryIngredient[]> {
  // Early return if no meals
  if (!mealSummaries || mealSummaries.length === 0) {
    return [];
  }

  const mealIds = mealSummaries.map((meal) => meal.meal_id);

  const { data: ingredients, error: ingredientsError } = await supabase
    .from("food_diary_ingredients")
    .select(`
      *,
      ingredient:ingredients (*)
    `)
    .in("diary_meal_id", mealIds);

  if (ingredientsError) {
    throw mapSupabaseErrorToAppError(ingredientsError);
  }

  return ingredients || [];
}

// Alternative version that takes meal IDs directly
export async function fetchMealIngredientsByIds(
  supabase: SupabaseClient,
  mealIds: string[]
): Promise<FoodDiaryIngredient[]> {
  if (!mealIds || mealIds.length === 0) {
    return [];
  }

  const { data: ingredients, error: ingredientsError } = await supabase
    .from("food_diary_ingredients")
    .select(`
      *,
      ingredient:ingredients (*)
    `)
    .in("diary_meal_id", mealIds);

  if (ingredientsError) {
    throw mapSupabaseErrorToAppError(ingredientsError);
  }

  return ingredients || [];
}
