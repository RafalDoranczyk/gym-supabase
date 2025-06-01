"use server";

import { DB_TABLES, assertZodParse, createServerClient, mapSupabaseErrorToAppError } from "@/utils";
import {
  type GetNutritionGroupsWithExamplesResponse,
  GetNutritionGroupsWithExamplesResponseSchema,
  type Ingredient,
} from "@repo/schemas";

export async function fetchIngredientGroupsWithExamples(): Promise<GetNutritionGroupsWithExamplesResponse> {
  const supabase = await createServerClient();

  const { data, error, count } = await supabase
    .from(DB_TABLES.INGREDIENT_GROUPS)
    .select(
      `
      *,
      ${DB_TABLES.INGREDIENTS}:${DB_TABLES.INGREDIENTS}(name)
    `,
      { count: "exact" },
    )
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

  const response = {
    data: transformedData,
    count: count || 0,
  };

  return assertZodParse(GetNutritionGroupsWithExamplesResponseSchema, response);
}
