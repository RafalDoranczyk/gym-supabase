"use server";

import { assertZodParse, createServerClient, mapSupabaseErrorToAppError } from "@/utils";
import { type GetNutritionGroupsResponse, GetNutritionGroupsResponseSchema } from "@repo/schemas";

export async function fetchIngredientGroups(): Promise<GetNutritionGroupsResponse> {
  const supabase = await createServerClient();

  const { data, error, count } = await supabase
    .from("ingredient_groups")
    .select("*", { count: "exact" })
    .order("name", { ascending: true });

  if (error) {
    throw mapSupabaseErrorToAppError(error);
  }

  return assertZodParse(GetNutritionGroupsResponseSchema, { data: data || [], count: count || 0 });
}
