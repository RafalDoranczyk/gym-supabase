"use server";

import { PATHS } from "@/constants";
import { getUserScopedQuery, mapSupabaseErrorToAppError } from "@/utils";
import { revalidatePath } from "next/cache";

export async function deleteFoodDiaryMeal(mealId: string): Promise<void> {
  const { user, supabase } = await getUserScopedQuery();

  const { error: deleteError } = await supabase
    .from("food_diary_meals")
    .delete()
    .eq("id", mealId)
    .eq("user_id", user.id);

  if (deleteError) {
    throw mapSupabaseErrorToAppError(deleteError);
  }

  revalidatePath(PATHS.NUTRITION.ROOT);
}

export async function deleteFoodDiaryMeals(mealIds: string[]): Promise<number> {
  if (mealIds.length === 0) return 0;

  const { user, supabase } = await getUserScopedQuery();

  const { error: deleteError, count } = await supabase
    .from("food_diary_meals")
    .delete()
    .in("id", mealIds)
    .eq("user_id", user.id);

  if (deleteError) {
    throw mapSupabaseErrorToAppError(deleteError);
  }

  revalidatePath(PATHS.NUTRITION.ROOT);
  return count || 0;
}
