"use server";

import { PATHS } from "@/constants";
import { getUserScopedQuery, mapSupabaseErrorToAppError } from "@/core/supabase";
import { assertZodParse } from "@/utils";
import { revalidatePath } from "next/cache";
import {
  DeleteFoodDiaryMealPayloadSchema,
  FoodDiaryMealSchema,
  type DeleteFoodDiaryMealPayload,
  type DeleteFoodDiaryMealResponse,
} from "../schemas";

export async function deleteFoodDiaryMeal(
  payload: DeleteFoodDiaryMealPayload
): Promise<DeleteFoodDiaryMealResponse> {
  const validatedPayload = assertZodParse(DeleteFoodDiaryMealPayloadSchema, payload);

  const { user, supabase } = await getUserScopedQuery();

  const { data, error } = await supabase
    .from("food_diary_meals")
    .delete()
    .eq("id", validatedPayload.id)
    .eq("user_id", user.id)
    .select("*")
    .single();

  if (error) {
    throw mapSupabaseErrorToAppError(error);
  }

  revalidatePath(PATHS.NUTRITION.ROOT);

  return assertZodParse(FoodDiaryMealSchema, data);
}

export async function deleteFoodDiaryMeals(mealIds: string[]): Promise<number> {
  if (mealIds.length === 0) return 0;

  const { user, supabase } = await getUserScopedQuery();

  const { error, count } = await supabase
    .from("food_diary_meals")
    .delete()
    .in("id", mealIds)
    .eq("user_id", user.id);

  if (error) {
    throw mapSupabaseErrorToAppError(error);
  }

  revalidatePath(PATHS.NUTRITION.ROOT);

  return count || 0;
}
