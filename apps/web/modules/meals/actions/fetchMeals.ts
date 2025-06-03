"use server";

import { assertZodParse, createServerClient, mapSupabaseErrorToAppError } from "@/utils";
import {
  type GetMealsResponse,
  GetMealsResponseSchema,
  MEALS_FETCH_LIMIT,
  type MealSearchParams,
  MealSearchParamsSchema,
} from "@repo/schemas";

export async function fetchMeals(params: MealSearchParams): Promise<GetMealsResponse> {
  // Validate input parameters
  const validatedParams = assertZodParse(MealSearchParamsSchema, params);

  const supabase = await createServerClient();

  const {
    limit = MEALS_FETCH_LIMIT,
    offset = 0,
    order = "asc",
    orderBy = "name",
    search,
    tag,
  } = validatedParams;

  // Parse and validate tag IDs
  const tagIds =
    tag
      ?.split(",")
      .map((id) => id.trim())
      .filter(Boolean) ?? [];

  let filteredMealIds: string[] | undefined = undefined;

  // Pre-filter by tags if specified
  if (tagIds.length > 0) {
    const { data: tagLinks, error: tagError } = await supabase
      .from("meal_to_tags")
      .select("meal_id")
      .in("tag_id", tagIds);

    if (tagError) {
      throw mapSupabaseErrorToAppError(tagError);
    }

    filteredMealIds = tagLinks?.map((link) => link.meal_id) ?? [];

    // Early return if no meals match the tag filter
    if (filteredMealIds.length === 0) {
      return { count: 0, data: [] };
    }
  }

  // Build the main query
  let mealsQuery = supabase.from("meals").select(
    `
    *,
    meal_to_tags (
      tag:meal_tags (
        id,
        name
      )
    ),
    meal_ingredients (
      amount,
      ingredient:ingredients (
        id,
        name,
        unit_type,
        calories,
        protein,
        carbs,
        fat,
        price
      )
    )
  `,
    { count: "exact" },
  );

  // Apply filters
  if (filteredMealIds) {
    mealsQuery = mealsQuery.in("id", filteredMealIds);
  }

  if (search?.trim()) {
    mealsQuery = mealsQuery.ilike("name", `%${search.trim()}%`);
  }

  // Apply sorting and pagination
  mealsQuery = mealsQuery
    .order(orderBy, { ascending: order === "asc" })
    .range(offset, offset + limit - 1);

  const { count, data, error } = await mealsQuery;

  if (error) {
    throw mapSupabaseErrorToAppError(error);
  }

  return assertZodParse(GetMealsResponseSchema, {
    count: count ?? 0,
    data: data ?? [],
  });
}
