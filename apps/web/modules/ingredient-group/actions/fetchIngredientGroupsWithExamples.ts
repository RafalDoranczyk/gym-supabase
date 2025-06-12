"use server";

import { assertZodParse, createServerClient, mapSupabaseErrorToAppError } from "@/utils";
import {
  type FetchIngredientGroupsWithExamplesResponse,
  FetchIngredientGroupsWithExamplesResponseSchema,
  type Ingredient,
} from "@repo/schemas";

export async function fetchIngredientGroupsWithExamples(): Promise<FetchIngredientGroupsWithExamplesResponse> {
  const supabase = await createServerClient();

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
