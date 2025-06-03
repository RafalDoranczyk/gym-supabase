"use server";

import { assertZodParse, getUserScopedQuery, mapSupabaseErrorToAppError } from "@/utils";
import {
  type CreateMealTagPayload,
  type CreateMealTagResponse,
  MealTagSchema,
} from "@repo/schemas";
import { revalidatePath } from "next/cache";

export async function createMealTag(payload: CreateMealTagPayload): Promise<CreateMealTagResponse> {
  const { user, supabase } = await getUserScopedQuery();

  const { data, error } = await supabase
    .from("meal_tags")
    .insert([{ ...payload, user_id: user.id }])
    .select("*")
    .single();

  if (error) {
    throw mapSupabaseErrorToAppError(error);
  }

  revalidatePath("/dashboard/data-management");

  return assertZodParse(MealTagSchema, data);
}
