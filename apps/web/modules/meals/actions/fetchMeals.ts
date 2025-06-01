"use server";

import { assertZodParse, createServerClient, DB_TABLES, mapSupabaseErrorToAppError } from "@/utils";
import {
  type GetMealsResponse,
  GetMealsResponseSchema,
  MEALS_FETCH_LIMIT,
  type MealSearchParams,
} from "@repo/schemas";

export async function fetchMeals(params: MealSearchParams): Promise<GetMealsResponse> {
  const supabase = await createServerClient();

  const {
    limit = MEALS_FETCH_LIMIT,
    offset = 0,
    order = "asc",
    orderBy = "name",
    search,
    tag,
  } = params;

  const tagIds =
    tag
      ?.split(",")
      .map((id) => id.trim())
      .filter(Boolean) ?? [];

  let filteredMealIds: string[] | undefined = undefined;

  if (tagIds.length > 0) {
    const { data: tagLinks, error: tagError } = await supabase
      .from(DB_TABLES.MEAL_TO_TAGS)
      .select("meal_id")
      .in("tag_id", tagIds);

    if (tagError) {
      throw mapSupabaseErrorToAppError(tagError);
    }

    filteredMealIds = tagLinks?.map((link) => link.meal_id) ?? [];

    if (filteredMealIds.length === 0) {
      return { count: 0, data: [] };
    }
  }

  let mealsQuery = supabase.from(DB_TABLES.MEALS).select(
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

  if (filteredMealIds) {
    mealsQuery = mealsQuery.in("id", filteredMealIds);
  }

  if (search) {
    mealsQuery = mealsQuery.ilike("name", `%${search}%`);
  }

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
