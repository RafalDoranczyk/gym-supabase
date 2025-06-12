"use server";

import { assertZodParse, getUserScopedQuery } from "@/utils";
import {
  type FetchFoodDiaryDayPayload,
  FetchFoodDiaryDayPayloadSchema,
  type FetchFoodDiaryDayResponse,
  FoodDiaryDaySchema,
  type FoodDiaryIngredient,
  type MealNutritionSummary,
} from "@repo/schemas";
import { fetchDailyNutritionSummary } from "./fetchDailyNutritionSummary";
import { fetchMealIngredients } from "./fetchMealIngredients";
import { fetchMealSummaries } from "./fetchMealSummaries";

function combineMealsWithIngredients(
  mealSummaries: MealNutritionSummary[],
  ingredientsData: FoodDiaryIngredient[]
) {
  // Combine meal summaries with their ingredients
  return (
    mealSummaries?.map((mealSummary) => {
      const mealIngredients = ingredientsData.filter(
        (ing) => ing.diary_meal_id === mealSummary.meal_id
      );

      return {
        id: mealSummary.meal_id,
        user_id: mealSummary.user_id,
        entry_date: mealSummary.entry_date,
        meal_name: mealSummary.meal_name,
        meal_order: mealSummary.meal_order,
        created_at: mealSummary.created_at,
        // Pre-calculated totals from view (for meal headers)
        total_calories: mealSummary.meal_calories,
        total_protein: mealSummary.meal_protein,
        total_carbs: mealSummary.meal_carbs,
        total_fat: mealSummary.meal_fat,
        ingredient_count: mealSummary.ingredient_count,
        // Detailed ingredients (for ingredient lists in cards)
        food_diary_ingredients: mealIngredients,
      };
    }) || []
  );
}

export async function fetchFoodDiaryDay(
  payload: FetchFoodDiaryDayPayload
): Promise<FetchFoodDiaryDayResponse> {
  const validatedPayload = assertZodParse(FetchFoodDiaryDayPayloadSchema, payload);

  const { user, supabase } = await getUserScopedQuery();

  // Option 1: Use meal_nutrition_summary for fast totals + separate ingredients query
  // This gives us pre-calculated totals but also ingredient details for editing
  const { entry_date } = validatedPayload;

  // Parallel fetching for better performance
  const [meal_summaries, daily_summary] = await Promise.all([
    fetchMealSummaries(supabase, user.id, entry_date),
    fetchDailyNutritionSummary(supabase, user.id, entry_date),
  ]);

  // Ingredients depend on meal summaries, so fetch after
  const ingredients_data = await fetchMealIngredients(supabase, meal_summaries);

  // Combine meal summaries with their ingredients
  const meals = combineMealsWithIngredients(meal_summaries, ingredients_data);

  return assertZodParse(FoodDiaryDaySchema, { entry_date, meals, daily_summary });
}
