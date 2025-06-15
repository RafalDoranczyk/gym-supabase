"use server";

import { PATHS } from "@/constants";
import { getUserScopedQuery, mapSupabaseErrorToAppError } from "@/core/supabase";
import { assertZodParse } from "@/utils";
import {
  type CreateMealPayload,
  CreateMealPayloadSchema,
  type CreateMealResponse,
  MealSchema,
} from "@repo/schemas";
import { revalidatePath } from "next/cache";

export async function createMeal(payload: CreateMealPayload): Promise<CreateMealResponse> {
  const validatedPayload = assertZodParse(CreateMealPayloadSchema, payload);

  const { user, supabase } = await getUserScopedQuery();

  // 1. Create the meal
  const { data: meal, error: insertMealError } = await supabase
    .from("meals")
    .insert({
      name: validatedPayload.name,
      description: validatedPayload.description,
      user_id: user.id,
    })
    .select("*")
    .single();

  if (insertMealError || !meal) {
    throw mapSupabaseErrorToAppError(insertMealError);
  }

  // 2. Insert meal ingredients (if any)
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

  // 3. Handle meal tags (if any)
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

  // 4. Fetch the complete meal with all relations
  const { data: completeMeal, error: fetchError } = await supabase
    .from("meals")
    .select(`
      *,
      meal_ingredients (
        *,
        ingredient:ingredients (*)
      ),
      meal_to_tags (
        tag:meal_tags (*)
      )
    `)
    .eq("id", meal.id)
    .single();

  if (fetchError || !completeMeal) {
    throw mapSupabaseErrorToAppError(fetchError);
  }

  revalidatePath(PATHS.LIBRARY.MEALS);
  return assertZodParse(MealSchema, completeMeal);
}
