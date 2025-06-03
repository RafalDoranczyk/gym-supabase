"use server";

import { DB_TABLES, assertZodParse, createServerClient, mapSupabaseErrorToAppError } from "@/utils";
import { type GetIngredientsResponse, GetIngredientsResponseSchema } from "@repo/schemas";
import type { z } from "zod";
import { type IngredientSearchParams, IngredientSearchParamsSchema } from "../constants";
import {
  INGREDIENTS_DEFAULT_OFFSET,
  INGREDIENTS_DEFAULT_ORDER,
  INGREDIENTS_DEFAULT_ORDER_BY,
  INGREDIENTS_DEFAULT_PAGE_SIZE,
} from "../constants/pagination";

/**
 * Builds Supabase query with filters, search, and pagination
 */

function buildIngredientsQuery(
  supabase: Awaited<ReturnType<typeof createServerClient>>,
  params: IngredientSearchParams,
  groupId?: string,
) {
  let query = supabase.from(DB_TABLES.INGREDIENTS).select(
    `
      *,
      ingredient_groups!inner(name)
    `,
    { count: "exact" },
  );

  // Filter by group name directly in JOIN
  if (params.group?.trim()) {
    query = query.eq("ingredient_groups.name", params.group);
  }

  // Search by ingredient name
  if (params.search?.trim()) {
    query = query.ilike("name", `%${params.search.trim()}%`);
  }

  // Apply sorting and pagination with fallbacks
  const offset = params.offset ?? INGREDIENTS_DEFAULT_OFFSET;
  const limit = params.limit ?? INGREDIENTS_DEFAULT_PAGE_SIZE;
  const orderBy = params.orderBy ?? INGREDIENTS_DEFAULT_ORDER_BY;
  const order = params.order ?? INGREDIENTS_DEFAULT_ORDER;

  return query.range(offset, offset + limit - 1).order(orderBy, { ascending: order === "asc" });
}

export async function fetchIngredients(
  payload?: Partial<z.input<typeof IngredientSearchParamsSchema>>,
): Promise<GetIngredientsResponse> {
  // Validate input
  const validatedPayload = assertZodParse(IngredientSearchParamsSchema, payload ?? {});

  const supabase = await createServerClient();

  // Handle group filtering with separate query if needed
  let groupId: string | undefined;
  if (validatedPayload.group?.trim()) {
    const { data: groups } = await supabase
      .from(DB_TABLES.INGREDIENT_GROUPS)
      .select("id")
      .eq("name", validatedPayload.group)
      .single();

    groupId = groups?.id;
  }

  // Build and execute query
  const query = buildIngredientsQuery(supabase, validatedPayload, groupId);
  const { count, data, error } = await query;

  if (error) {
    throw mapSupabaseErrorToAppError(error);
  }

  // Validate output
  return assertZodParse(GetIngredientsResponseSchema, {
    count: count ?? 0,
    data: data ?? [],
  });
}
