"use server";

import { DB_TABLES, assertZodParse, getUserScopedQuery, mapSupabaseErrorToAppError } from "@/utils";
import { type CreateMealPayload, type CreateMealResponse, MealSchema } from "@repo/schemas";
import { revalidatePath } from "next/cache";

export async function createMeal(payload: CreateMealPayload): Promise<CreateMealResponse> {
  const { user, supabase } = await getUserScopedQuery();

  // 1. Create the meal
  const { data: meal, error: insertMealError } = await supabase
    .from(DB_TABLES.MEALS)
    .insert({
      name: payload.name,
      description: payload.description,
      user_id: user.id,
    })
    .select("*")
    .single();

  if (insertMealError || !meal) {
    throw mapSupabaseErrorToAppError(insertMealError);
  }

  // 2. Insert meal ingredients (if any)
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
      // Cleanup: Delete the created meal if ingredients failed
      await supabase.from(DB_TABLES.MEALS).delete().eq("id", meal.id);
      throw mapSupabaseErrorToAppError(insertIngredientsError);
    }
  }

  // 3. Handle meal tags (if any)
  if (payload.tag_ids && payload.tag_ids.length > 0) {
    const mealTags = payload.tag_ids.map((tagId) => ({
      meal_id: meal.id,
      tag_id: tagId,
    }));

    const { error: insertTagsError } = await supabase.from(DB_TABLES.MEAL_TO_TAGS).insert(mealTags);

    if (insertTagsError) {
      // Cleanup: Delete meal and ingredients if tags failed
      await supabase.from(DB_TABLES.MEAL_INGREDIENTS).delete().eq("meal_id", meal.id);
      await supabase.from(DB_TABLES.MEALS).delete().eq("id", meal.id);
      throw mapSupabaseErrorToAppError(insertTagsError);
    }
  }

  // 4. Fetch the complete meal with all relations
  const { data: completeMeal, error: fetchError } = await supabase
    .from(DB_TABLES.MEALS)
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

  revalidatePath("/dashboard/meals");

  return assertZodParse(MealSchema, completeMeal);
}
