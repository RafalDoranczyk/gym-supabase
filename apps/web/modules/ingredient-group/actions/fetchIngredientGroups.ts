"use server";

import { createSupabase, getUserScopedQuery, mapSupabaseErrorToAppError } from "@/core/supabase";
import type { Ingredient } from "@/modules/ingredient";
import { assertZodParse } from "@/utils";
import {
  type FetchIngredientGroupsResponse,
  FetchIngredientGroupsResponseSchema,
  type FetchIngredientGroupsWithExamplesResponse,
  FetchIngredientGroupsWithExamplesResponseSchema,
} from "../schemas";

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

export async function fetchIngredientGroupsWithExamples(): Promise<FetchIngredientGroupsWithExamplesResponse> {
  const supabase = await createSupabase();

  const { data, error, count } = await supabase
    .from("ingredient_groups")
    .select("*, ingredients:ingredients(name)", { count: "exact" })
    .order("name", { ascending: true });

  if (error) {
    throw mapSupabaseErrorToAppError(error);
  }

  // Transform data to include examples and ingredientsCount
  const transformedData = (data || []).map((group) => ({
    ...group,
    ingredientsCount: group.ingredients?.length || 0,
    examples: (group.ingredients || [])
      .slice(0, 3)
      .map((ingredient: Ingredient) => ingredient.name),
  }));

  return assertZodParse(FetchIngredientGroupsWithExamplesResponseSchema, {
    data: transformedData,
    count: count || 0,
  });
}
