"use server";

import { createSupabase, mapSupabaseErrorToAppError } from "@/core/supabase";
import { assertZodParse } from "@/utils";
import {
  type FetchMealsPayload,
  FetchMealsPayloadSchema,
  type FetchMealsResponse,
  FetchMealsResponseSchema,
} from "@repo/schemas";
import {
  MEALS_DEFAULT_OFFSET,
  MEALS_DEFAULT_ORDER,
  MEALS_DEFAULT_ORDER_BY,
  MEALS_DEFAULT_PAGE_SIZE,
} from "../constants/pagination";

/**
 * Pre-filters meal IDs by tags if specified
 */
async function getFilteredMealIdsByTags(
  supabase: Awaited<ReturnType<typeof createSupabase>>,
  tagFilter?: string
): Promise<string[] | undefined> {
  if (!tagFilter?.trim()) {
    return undefined;
  }

  // Parse and validate tag IDs
  const tagIds = tagFilter
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  if (tagIds.length === 0) {
    return undefined;
  }

  const { data: tagLinks, error } = await supabase
    .from("meal_to_tags")
    .select("meal_id")
    .in("tag_id", tagIds);

  if (error) {
    throw mapSupabaseErrorToAppError(error);
  }

  return tagLinks?.map((link) => link.meal_id) ?? [];
}

/**
 * Builds Supabase query with filters, search, and pagination
 */
function buildMealsQuery(
  supabase: Awaited<ReturnType<typeof createSupabase>>,
  params: FetchMealsPayload,
  filteredMealIds?: string[]
) {
  let query = supabase.from("meals").select(
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
    { count: "exact" }
  );

  // Filter by pre-filtered meal IDs (from tag filtering)
  if (filteredMealIds) {
    query = query.in("id", filteredMealIds);
  }

  // Search by meal name
  if (params.search?.trim()) {
    query = query.ilike("name", `%${params.search.trim()}%`);
  }

  // Apply sorting and pagination with fallbacks
  const offset = params.offset ?? MEALS_DEFAULT_OFFSET;
  const limit = params.limit ?? MEALS_DEFAULT_PAGE_SIZE;
  const orderBy = params.orderBy ?? MEALS_DEFAULT_ORDER_BY;
  const order = params.order ?? MEALS_DEFAULT_ORDER;

  return query.range(offset, offset + limit - 1).order(orderBy, { ascending: order === "asc" });
}

export async function fetchMeals(payload?: FetchMealsPayload): Promise<FetchMealsResponse> {
  const validatedPayload = assertZodParse(FetchMealsPayloadSchema, payload);

  const supabase = await createSupabase();

  // Pre-filter by tags if specified
  const filteredMealIds = await getFilteredMealIdsByTags(supabase, validatedPayload.tag);

  // Early return if no meals match the tag filter
  if (filteredMealIds && filteredMealIds.length === 0) {
    return assertZodParse(FetchMealsResponseSchema, {
      count: 0,
      data: [],
    });
  }

  // Build and execute query
  const query = buildMealsQuery(supabase, validatedPayload, filteredMealIds);
  const { count, data, error } = await query;

  if (error) {
    throw mapSupabaseErrorToAppError(error);
  }

  return assertZodParse(FetchMealsResponseSchema, {
    count: count ?? 0,
    data: data ?? [],
  });
}
