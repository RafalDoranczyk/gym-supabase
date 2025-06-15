"use server";

import { getUserScopedQuery, mapSupabaseErrorToAppError } from "@/core/supabase";
import type { Meal } from "@/modules/meal";
import { assertZodParse } from "@/utils";
import {
  FetchMealTagsResponseSchema,
  FetchMealTagsWithExamplesResponseSchema,
  type FetchMealTagsResponse,
  type FetchMealTagsWithExamplesResponse,
} from "../schemas";

export async function fetchMealTags(): Promise<FetchMealTagsResponse> {
  const { user, supabase } = await getUserScopedQuery();

  const { data, error, count } = await supabase
    .from("meal_tags")
    .select("*", { count: "exact" })
    .eq("user_id", user.id)
    .order("name", { ascending: true });

  if (error) {
    throw mapSupabaseErrorToAppError(error);
  }

  return assertZodParse(FetchMealTagsResponseSchema, {
    data,
    count,
  });
}

export async function fetchMealTagsWithExamples(): Promise<FetchMealTagsWithExamplesResponse> {
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
      { count: "exact" }
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

  return assertZodParse(FetchMealTagsWithExamplesResponseSchema, {
    data: transformedData,
    count: count,
  });
}
