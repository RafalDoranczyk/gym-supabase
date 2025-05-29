"use server";

import { assertZodParse, createServerClient, mapSupabaseErrorToAppError } from "@/utils";
import { type GetNutritionGroupResponse, GetNutritionGroupResponseSchema } from "@repo/schemas";

export async function fetchIngredientGroups(): Promise<GetNutritionGroupResponse> {
  const supabase = await createServerClient();

  const { data, error } = await supabase.from("ingredient_groups").select("*");

  if (error) {
    throw mapSupabaseErrorToAppError(error);
  }

  const groups = assertZodParse(GetNutritionGroupResponseSchema, data);

  return groups;
}
