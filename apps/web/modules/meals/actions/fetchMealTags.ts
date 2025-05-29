"use server";

import { assertZodParse, createServerClient, mapSupabaseErrorToAppError } from "@/utils";
import { type GetNutritionGroupResponse, GetNutritionGroupResponseSchema } from "@repo/schemas";

export async function fetchMealTags(): Promise<GetNutritionGroupResponse> {
  const supabase = await createServerClient();

  const { data, error } = await supabase.from("meal_tags").select("*");

  if (error) {
    throw mapSupabaseErrorToAppError(error);
  }

  const groups = assertZodParse(GetNutritionGroupResponseSchema, data);

  return groups;
}
