"use server";

import { DB_TABLES, assertZodParse, createServerClient, mapSupabaseErrorToAppError } from "@/utils";
import {
  type GetIngredientsResponse,
  GetIngredientsResponseSchema,
  type IngredientSearchParams,
} from "@repo/schemas";

// Helper function to build query filters
async function buildIngredientsQuery(
  supabase: Awaited<ReturnType<typeof createServerClient>>,
  params: Partial<IngredientSearchParams>,
) {
  // Extract params with defaults
  const {
    group = "",
    search = "",
    offset = 0,
    limit = 10,
    orderBy = "name",
    order = "asc",
  } = params;

  let query = supabase.from(DB_TABLES.INGREDIENTS).select("*", { count: "exact" });

  // If filtering by group name, first get the group ID
  if (group !== "") {
    const { data: groups } = await supabase
      .from(DB_TABLES.INGREDIENT_GROUPS)
      .select("id")
      .eq("name", group)
      .single();

    if (groups?.id) {
      query = query.eq("group_id", groups.id);
    }
  }

  if (search.trim()) {
    query = query.ilike("name", `%${search.trim()}%`);
  }

  // Apply pagination and sorting
  return query.range(offset, offset + limit - 1).order(orderBy, { ascending: order === "asc" });
}

export async function fetchIngredients(
  params?: IngredientSearchParams,
): Promise<GetIngredientsResponse> {
  const supabase = await createServerClient();

  // Build and execute query with validated params
  const query = await buildIngredientsQuery(supabase, params || {});

  const { count, data, error } = await query;

  if (error) {
    throw mapSupabaseErrorToAppError(error);
  }

  return assertZodParse(GetIngredientsResponseSchema, {
    count: count ?? 0,
    data: data ?? [],
  });
}
