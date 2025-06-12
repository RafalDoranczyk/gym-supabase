"use server";

import { PATHS } from "@/constants";
import { assertZodParse, getUserScopedQuery, mapSupabaseErrorToAppError } from "@/utils";
import {
  type CreateFoodDiaryMealPayload,
  CreateFoodDiaryMealPayloadSchema,
  type CreateFoodDiaryMealResponse,
  FoodDiaryMealSchema,
} from "@repo/schemas";
import { revalidatePath } from "next/cache";

export async function createFoodDiaryMeal(
  payload: CreateFoodDiaryMealPayload
): Promise<CreateFoodDiaryMealResponse> {
  const validatedPayload = assertZodParse(CreateFoodDiaryMealPayloadSchema, payload);

  const { user, supabase } = await getUserScopedQuery();

  // 1. Create the food diary meal
  const { data: diaryMeal, error: insertMealError } = await supabase
    .from("food_diary_meals")
    .insert({
      user_id: user.id,
      entry_date: validatedPayload.entry_date,
      meal_name: validatedPayload.meal_name,
      meal_order: validatedPayload.meal_order,
    })
    .select("*")
    .single();

  if (insertMealError || !diaryMeal) {
    throw mapSupabaseErrorToAppError(insertMealError);
  }

  // 2. Insert food diary ingredients (if any)
  if (validatedPayload.ingredients && validatedPayload.ingredients.length > 0) {
    const diaryIngredients = validatedPayload.ingredients.map((ingredient) => ({
      diary_meal_id: diaryMeal.id,
      ingredient_id: ingredient.ingredient_id,
      quantity: ingredient.quantity,
      total_calories: ingredient.total_calories,
      total_protein: ingredient.total_protein,
      total_carbs: ingredient.total_carbs,
      total_fat: ingredient.total_fat,
    }));

    const { error: insertIngredientsError } = await supabase
      .from("food_diary_ingredients")
      .insert(diaryIngredients);

    if (insertIngredientsError) {
      throw mapSupabaseErrorToAppError(insertIngredientsError);
    }
  }

  // 3. Fetch the complete diary meal with all relations
  const { data: completeDiaryMeal, error: fetchError } = await supabase
    .from("food_diary_meals")
    .select(`
      *,
      food_diary_ingredients (
        *,
        ingredient:ingredients (*)
      )
    `)
    .eq("id", diaryMeal.id)
    .single();

  if (fetchError || !completeDiaryMeal) {
    throw mapSupabaseErrorToAppError(fetchError);
  }

  revalidatePath(PATHS.NUTRITION.ROOT);
  return assertZodParse(FoodDiaryMealSchema, completeDiaryMeal);
}
