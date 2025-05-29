"use server";

import { assertZodParse, createServerClient, mapSupabaseErrorToAppError } from "@/utils";
import {
  type GetIngredientsResponse,
  GetIngredientsResponseSchema,
  type IngredientSearchParams,
  type NutritionGroup,
} from "@repo/schemas";

import { INGREDIENTS_FETCH_LIMIT } from "../const";

export async function fetchIngredients(
  params?: IngredientSearchParams,
  ingredientGroups?: NutritionGroup[],
): Promise<GetIngredientsResponse> {
  const supabase = await createServerClient();

  const {
    group,
    limit = INGREDIENTS_FETCH_LIMIT,
    offset = 0,
    order = "asc",
    orderBy = "name",
    search,
  } = params ?? {};

  const groupId =
    group && ingredientGroups ? ingredientGroups.find((g) => g.name === group)?.id : undefined;

  let ingredientsQuery = supabase.from("ingredients").select("*", { count: "exact" });

  if (groupId) {
    ingredientsQuery = ingredientsQuery.eq("group_id", groupId);
  }

  if (search) {
    ingredientsQuery = ingredientsQuery.ilike("name", `%${search}%`);
  }

  ingredientsQuery = ingredientsQuery
    .range(offset, offset + limit - 1)
    .order(orderBy, { ascending: order === "asc" });

  const { count, data, error } = await ingredientsQuery;

  if (error) {
    throw mapSupabaseErrorToAppError(error);
  }

  const parsed = assertZodParse(GetIngredientsResponseSchema, {
    count,
    data,
  });

  return parsed;
}
