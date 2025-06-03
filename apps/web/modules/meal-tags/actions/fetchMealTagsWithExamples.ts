"use server";

import { assertZodParse, getUserScopedQuery, mapSupabaseErrorToAppError } from "@/utils";
import {
  type GetMealTagsWithExamplesResponse,
  GetMealTagsWithExamplesResponseSchema,
  type Meal,
} from "@repo/schemas";

export async function fetchMealTagsWithExamples(): Promise<GetMealTagsWithExamplesResponse> {
  const { user, supabase } = await getUserScopedQuery();

  const { data, error, count } = await supabase
    .from("meal_tags")
    .select(
      `
      *,
      meal_to_tags(
        meals(name)
      )
    `,
      { count: "exact" },
    )
    .eq("user_id", user.id)
    .order("name", { ascending: true });

  if (error) {
    throw mapSupabaseErrorToAppError(error);
  }

  // Transform data to include usage count and meal examples
  const transformedData = (data || []).map((tag) => ({
    ...tag,
    mealsCount: tag.meal_to_tags?.length || 0,
    examples: (tag.meal_to_tags || [])
      .slice(0, 3)
      .map((relation: { meals: Meal }) => relation.meals?.name),
  }));

  return assertZodParse(GetMealTagsWithExamplesResponseSchema, {
    data: transformedData,
    count: count || 0,
  });
}
