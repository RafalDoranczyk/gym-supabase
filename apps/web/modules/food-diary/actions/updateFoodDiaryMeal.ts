"use server";

import { PATHS } from "@/constants";
import { getUserScopedQuery, mapSupabaseErrorToAppError } from "@/core/supabase";
import { assertZodParse } from "@/utils";
import { revalidatePath } from "next/cache";
import {
  FoodDiaryMealSchema,
  type UpdateFoodDiaryMealPayload,
  UpdateFoodDiaryMealPayloadSchema,
  type UpdateFoodDiaryMealResponse,
} from "../schemas";

export async function updateFoodDiaryMeal(
  payload: UpdateFoodDiaryMealPayload
): Promise<UpdateFoodDiaryMealResponse> {
  const validatedPayload = assertZodParse(UpdateFoodDiaryMealPayloadSchema, payload);

  const { user, supabase } = await getUserScopedQuery();

  // 1. Verify ownership
  const { data: existingMeal, error: verifyError } = await supabase
    .from("food_diary_meals")
    .select("id")
    .eq("id", validatedPayload.id)
    .eq("user_id", user.id)
    .single();

  if (verifyError || !existingMeal) {
    throw mapSupabaseErrorToAppError(verifyError);
  }

  // 2. Update meal basic info
  const { error: updateMealError } = await supabase
    .from("food_diary_meals")
    .update({
      meal_name: validatedPayload.meal_name,
      meal_order: validatedPayload.meal_order,
    })
    .eq("id", validatedPayload.id);

  if (updateMealError) {
    throw mapSupabaseErrorToAppError(updateMealError);
  }

  // 3. Replace all ingredients
  const { error: deleteIngredientsError } = await supabase
    .from("food_diary_ingredients")
    .delete()
    .eq("diary_meal_id", validatedPayload.id);

  if (deleteIngredientsError) {
    throw mapSupabaseErrorToAppError(deleteIngredientsError);
  }

  // Insert new ingredients if any
  if (validatedPayload.ingredients && validatedPayload.ingredients.length > 0) {
    const diaryIngredients = validatedPayload.ingredients.map((ingredient) => ({
      diary_meal_id: validatedPayload.id,
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

  // 4. Fetch updated meal
  const { data: updatedMeal, error: fetchError } = await supabase
    .from("food_diary_meals")
    .select(`
      *,
      food_diary_ingredients (
        *,
        ingredient:ingredients (*)
      )
    `)
    .eq("id", validatedPayload.id)
    .single();

  if (fetchError || !updatedMeal) {
    throw mapSupabaseErrorToAppError(fetchError);
  }

  revalidatePath(PATHS.NUTRITION.ROOT);
  return assertZodParse(FoodDiaryMealSchema, updatedMeal);
}
