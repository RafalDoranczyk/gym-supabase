"use server";

import { assertZodParse, createServerClient, mapSupabaseErrorToAppError } from "@/utils";
import {
  type GetMealsResponse,
  GetMealsResponseSchema,
  type MealSearchParams,
} from "@repo/schemas";

export async function fetchMeals(params: MealSearchParams): Promise<GetMealsResponse> {
  const supabase = await createServerClient();

  const { limit = 10, offset = 0, order = "asc", orderBy = "name", search, tag } = params;

  const tagIds =
    tag
      ?.split(",")
      .map((id) => id.trim())
      .filter(Boolean) ?? [];

  let filteredMealIds: string[] | undefined = undefined;

  if (tagIds.length > 0) {
    const { data: tagLinks, error: tagError } = await supabase
      .from("meal_to_tags")
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

  const parsed = assertZodParse(GetMealsResponseSchema, {
    count,
    data,
  });

  return parsed;
}
