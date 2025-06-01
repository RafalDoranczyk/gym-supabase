"use server";

import { assertZodParse, DB_TABLES, getUserScopedQuery, mapSupabaseErrorToAppError } from "@/utils";
import {
  MealTagSchema,
  type DeleteMealTagPayload,
  type DeleteMealTagResponse,
} from "@repo/schemas";
import { revalidatePath } from "next/cache";

export async function deleteMealTag(id: DeleteMealTagPayload): Promise<DeleteMealTagResponse> {
  const { user, supabase } = await getUserScopedQuery();

  const { data, error } = await supabase
    .from(DB_TABLES.MEAL_TAGS)
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)
    .select("*")
    .single();

  if (error) {
    throw mapSupabaseErrorToAppError(error);
  }

  revalidatePath("/dashboard/data-management");

  return assertZodParse(MealTagSchema, data);
}
