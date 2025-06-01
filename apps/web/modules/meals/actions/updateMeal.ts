"use server";

import { assertZodParse, DB_TABLES, getUserScopedQuery, mapSupabaseErrorToAppError } from "@/utils";
import { type UpdateMealPayload, type UpdateMealResponse, MealSchema } from "@repo/schemas";
import { revalidatePath } from "next/cache";

export async function updateMeal(payload: UpdateMealPayload): Promise<UpdateMealResponse> {
  const { user, supabase } = await getUserScopedQuery();

  const { data: meal, error: updateMealError } = await supabase
    .from(DB_TABLES.MEALS)
    .update({
      name: payload.name,
      description: payload.description,
    })
    .eq("id", payload.id)
    .eq("user_id", user.id) // Security: only update user's own meals
    .select("*")
    .single();

  if (updateMealError || !meal) {
    throw mapSupabaseErrorToAppError(updateMealError);
  }

  // 2. Update meal ingredients - replace all existing
  // First, delete existing ingredients
  const { error: deleteIngredientsError } = await supabase
    .from(DB_TABLES.MEAL_INGREDIENTS)
    .delete()
    .eq("meal_id", meal.id);

  if (deleteIngredientsError) {
    throw mapSupabaseErrorToAppError(deleteIngredientsError);
  }

  // Then, insert new ingredients (if any)
  if (payload.ingredients && payload.ingredients.length > 0) {
    const mealIngredients = payload.ingredients.map((ingredient) => ({
      meal_id: meal.id,
      ingredient_id: ingredient.ingredient_id,
      amount: ingredient.amount,
    }));

    const { error: insertIngredientsError } = await supabase
      .from(DB_TABLES.MEAL_INGREDIENTS)
      .insert(mealIngredients);

    if (insertIngredientsError) {
      throw mapSupabaseErrorToAppError(insertIngredientsError);
    }
  }

  // 3. Update meal tags - replace all existing
  // First, delete existing tag relations
  const { error: deleteTagsError } = await supabase
    .from("meal_tags_relation")
    .delete()
    .eq("meal_id", meal.id);

  if (deleteTagsError) {
    throw mapSupabaseErrorToAppError(deleteTagsError);
  }

  // Then, insert new tag relations (if any)
  if (payload.tag_ids && payload.tag_ids.length > 0) {
    const mealTags = payload.tag_ids.map((tagId) => ({
      meal_id: meal.id,
      tag_id: tagId,
    }));

    const { error: insertTagsError } = await supabase.from("meal_tags_relation").insert(mealTags);

    if (insertTagsError) {
      throw mapSupabaseErrorToAppError(insertTagsError);
    }
  }

  revalidatePath("/dashboard/meals");

  return assertZodParse(MealSchema, meal);
}
