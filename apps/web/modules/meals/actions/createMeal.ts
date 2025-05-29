"use server";

import { getUser } from "@/actions";
import { createServerClient, mapSupabaseErrorToAppError } from "@/utils";
import type { Meal } from "@repo/schemas";

export async function createMeal(mealData: Meal) {
  const user = await getUser();
  const supabase = await createServerClient();

  const { data: meal, error: mealError } = await supabase
    .from("meal")
    .insert({
      description: mealData.description,
      name: mealData.name,
      user_id: user.id,
    })
    .select()
    .single();

  if (mealError || !meal) {
    throw mapSupabaseErrorToAppError(mealError);
  }

  console.log(meal);

  const mappedIngredients = mealData.meal_ingredients.map((ing) => ({
    amount: ing.amount,
    ingredient_id: ing.ingredient.id,
    meal_id: meal.id,
  }));

  const { error: linkError } = await supabase.from("meal_ingredients").insert(mappedIngredients);

  if (linkError) {
    throw mapSupabaseErrorToAppError(linkError);
  }

  return meal;
}
