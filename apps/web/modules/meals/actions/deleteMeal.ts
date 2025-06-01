"use server";

import { assertZodParse, DB_TABLES, getUserScopedQuery, mapSupabaseErrorToAppError } from "@/utils";
import { MealSchema, type DeleteMealPayload, type DeleteMealResponse } from "@repo/schemas";
import { revalidatePath } from "next/cache";

export async function deleteMeal(id: DeleteMealPayload): Promise<DeleteMealResponse> {
  const { user, supabase } = await getUserScopedQuery();

  const { data, error } = await supabase
    .from(DB_TABLES.MEALS)
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)
    .select("*")
    .single();

  if (error) {
    throw mapSupabaseErrorToAppError(error);
  }

  revalidatePath("/dashboard/meals");

  return assertZodParse(MealSchema, data);
}
