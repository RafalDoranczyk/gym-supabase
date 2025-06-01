"use server";

import { assertZodParse, DB_TABLES, getUserScopedQuery, mapSupabaseErrorToAppError } from "@/utils";
import {
  MealTagSchema,
  type UpdateMealTagPayload,
  type UpdateMealTagResponse,
} from "@repo/schemas";
import { revalidatePath } from "next/cache";

export async function updateMealTag(payload: UpdateMealTagPayload): Promise<UpdateMealTagResponse> {
  const { user, supabase } = await getUserScopedQuery();

  const { data, error } = await supabase
    .from(DB_TABLES.MEAL_TAGS)
    .update(payload)
    .eq("id", payload.id)
    .eq("user_id", user.id)
    .select("*")
    .single();

  if (error) {
    throw mapSupabaseErrorToAppError(error);
  }

  revalidatePath("/dashboard/data-management");

  return assertZodParse(MealTagSchema, data);
}
