"use server";

import { getUserScopedQuery, mapSupabaseErrorToAppError } from "@/core/supabase";
import { assertZodParse } from "@/utils";
import {
  type FetchIngredientGroupsResponse,
  FetchIngredientGroupsResponseSchema,
} from "@repo/schemas";

export async function fetchIngredientGroups(): Promise<FetchIngredientGroupsResponse> {
  const { user, supabase } = await getUserScopedQuery();

  const { data, error, count } = await supabase
    .from("ingredient_groups")
    .select("*", { count: "exact" })
    .order("name", { ascending: true })
    .eq("user_id", user.id);

  if (error) {
    throw mapSupabaseErrorToAppError(error);
  }

  return assertZodParse(FetchIngredientGroupsResponseSchema, {
    data: data || [],
    count: count || 0,
  });
}
