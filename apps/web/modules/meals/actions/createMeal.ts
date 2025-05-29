"use server";

import { getUser } from "@/actions";
import { assertZodParse, createServerClient, mapSupabaseErrorToAppError } from "@/utils";
import { MealSchema, type CreateMealPayload } from "@repo/schemas";
import { revalidatePath } from "next/cache";

export async function createMeal(payload: CreateMealPayload) {
  const user = await getUser();
  const supabase = await createServerClient();

  const { data: meal, error: insertMealError } = await supabase
    .from("meals")
    .insert({
      name: payload.name,
      description: payload.description,
      user_id: user.id,
    })
    .select()
    .single();

  if (insertMealError || !meal) {
    throw mapSupabaseErrorToAppError(insertMealError);
  }

  const mealIngredients = payload.ingredients.map((i) => ({
    meal_id: meal.id,
    ingredient_id: i.ingredient_id,
    amount: i.amount,
  }));

  const { error: insertIngredientsError } = await supabase
    .from("meal_ingredients")
    .insert(mealIngredients);

  if (insertIngredientsError) {
    throw mapSupabaseErrorToAppError(insertIngredientsError);
  }

  const validated = assertZodParse(MealSchema, meal);

  revalidatePath("/dashboard/meals");

  return validated;
}
