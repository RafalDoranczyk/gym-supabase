"use server";

import { PATHS } from "@/constants";
import { assertZodParse, getUserScopedQuery, mapSupabaseErrorToAppError } from "@/utils";
import {
  MealSchema,
  type UpdateMealPayload,
  UpdateMealPayloadSchema,
  type UpdateMealResponse,
} from "@repo/schemas";
import { revalidatePath } from "next/cache";

export async function updateMeal(payload: UpdateMealPayload): Promise<UpdateMealResponse> {
  const validatedPayload = assertZodParse(UpdateMealPayloadSchema, payload);

  const { user, supabase } = await getUserScopedQuery();

  // First verify the meal exists and belongs to the user
  const { data: existingMeal, error: checkError } = await supabase
    .from("meals")
    .select("id")
    .eq("id", validatedPayload.id)
    .eq("user_id", user.id)
    .single();

  if (checkError || !existingMeal) {
    throw mapSupabaseErrorToAppError(checkError || new Error("Meal not found or unauthorized"));
  }

  // Update meal basic info
  const { data: meal, error: updateMealError } = await supabase
    .from("meals")
    .update({
      name: validatedPayload.name,
      description: validatedPayload.description,
    })
    .eq("id", validatedPayload.id)
    .eq("user_id", user.id)
    .select("*")
    .single();

  if (updateMealError || !meal) {
    throw mapSupabaseErrorToAppError(updateMealError);
  }

  // 2. Update meal ingredients - replace all existing
  const { error: deleteIngredientsError } = await supabase
    .from("meal_ingredients")
    .delete()
    .eq("meal_id", meal.id);

  if (deleteIngredientsError) {
    throw mapSupabaseErrorToAppError(deleteIngredientsError);
  }

  // Insert new ingredients (if any)
  if (validatedPayload.ingredients && validatedPayload.ingredients.length > 0) {
    const mealIngredients = validatedPayload.ingredients.map((ingredient) => ({
      meal_id: meal.id,
      ingredient_id: ingredient.ingredient_id,
      amount: ingredient.amount,
    }));

    const { error: insertIngredientsError } = await supabase
      .from("meal_ingredients")
      .insert(mealIngredients);

    if (insertIngredientsError) {
      throw mapSupabaseErrorToAppError(insertIngredientsError);
    }
  }

  // 3. Update meal tags - replace all existing
  const { error: deleteTagsError } = await supabase
    .from("meal_to_tags")
    .delete()
    .eq("meal_id", meal.id);

  if (deleteTagsError) {
    throw mapSupabaseErrorToAppError(deleteTagsError);
  }

  // Insert new tag relations (if any)
  if (validatedPayload.tag_ids && validatedPayload.tag_ids.length > 0) {
    const mealTags = validatedPayload.tag_ids.map((tagId) => ({
      meal_id: meal.id,
      tag_id: tagId,
    }));

    const { error: insertTagsError } = await supabase.from("meal_to_tags").insert(mealTags);

    if (insertTagsError) {
      throw mapSupabaseErrorToAppError(insertTagsError);
    }
  }
  revalidatePath(PATHS.LIBRARY.MEALS);
  return assertZodParse(MealSchema, meal);
}
