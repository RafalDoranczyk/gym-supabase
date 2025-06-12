"use server";

import { assertZodParse, createServerClient, mapSupabaseErrorToAppError } from "@/utils";
import {
  type FetchIngredientGroupsResponse,
  FetchIngredientGroupsResponseSchema,
} from "@repo/schemas";

export async function fetchIngredientGroups(): Promise<FetchIngredientGroupsResponse> {
  const supabase = await createServerClient();

  const { data, error, count } = await supabase
    .from("ingredient_groups")
    .select("*", { count: "exact" })
    .order("name", { ascending: true });

  if (error) {
    throw mapSupabaseErrorToAppError(error);
  }

  return assertZodParse(FetchIngredientGroupsResponseSchema, {
    data: data || [],
    count: count || 0,
  });
}
