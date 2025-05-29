"use server";

import { assertZodParse, createServerClient, mapSupabaseErrorToAppError } from "@/utils";
import {
  type GetIngredientsResponse,
  GetIngredientsResponseSchema,
  INGREDIENTS_FETCH_LIMIT,
  type IngredientSearchParams,
  type NutritionGroup,
} from "@repo/schemas";

// Helper function to build query filters
function buildIngredientsQuery(
  supabase: Awaited<ReturnType<typeof createServerClient>>,
  params: {
    groupId?: string;
    search?: string;
    limit: number;
    offset: number;
    orderBy: string;
    order: "asc" | "desc";
  },
) {
  let query = supabase.from("ingredients").select("*", { count: "exact" });

  // Apply filters
  if (params.groupId) {
    query = query.eq("group_id", params.groupId);
  }

  if (params.search?.trim()) {
    // More flexible search - could be extended to search multiple fields
    query = query.ilike("name", `%${params.search.trim()}%`);
  }

  // Apply pagination and sorting
  return query
    .range(params.offset, params.offset + params.limit - 1)
    .order(params.orderBy, { ascending: params.order === "asc" });
}

// Helper to find group ID
function findGroupId(groupName: string, ingredientGroups?: NutritionGroup[]): string | undefined {
  if (!ingredientGroups) return undefined;
  return ingredientGroups.find((g) => g.name === groupName)?.id;
}

export async function fetchIngredients(
  params?: IngredientSearchParams,
  ingredientGroups?: NutritionGroup[],
): Promise<GetIngredientsResponse> {
  const supabase = await createServerClient();

  // Extract and validate parameters
  const {
    group,
    limit = INGREDIENTS_FETCH_LIMIT,
    offset = 0,
    order = "asc",
    orderBy = "name",
    search,
  } = params ?? {};

  // Validate limit bounds
  const safeLimit = Math.min(Math.max(1, limit), INGREDIENTS_FETCH_LIMIT);
  const safeOffset = Math.max(0, offset);

  const groupId = group ? findGroupId(group, ingredientGroups) : undefined;

  // Build and execute query
  const query = buildIngredientsQuery(supabase, {
    groupId,
    search,
    limit: safeLimit,
    offset: safeOffset,
    orderBy,
    order,
  });

  const { count, data, error } = await query;

  if (error) {
    throw mapSupabaseErrorToAppError(error);
  }

  return assertZodParse(GetIngredientsResponseSchema, {
    count: count ?? 0,
    data: data ?? [],
  });
}
