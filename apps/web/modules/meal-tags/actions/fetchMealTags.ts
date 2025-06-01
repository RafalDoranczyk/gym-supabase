"use server";

import { DB_TABLES, assertZodParse, getUserScopedQuery, mapSupabaseErrorToAppError } from "@/utils";
import { type GetMealTagsResponse, GetMealTagsResponseSchema } from "@repo/schemas";

export async function fetchMealTags(): Promise<GetMealTagsResponse> {
  const { user, supabase } = await getUserScopedQuery();

  const { data, error, count } = await supabase
    .from(DB_TABLES.MEAL_TAGS)
    .select("*", { count: "exact" })
    .eq("user_id", user.id)
    .order("name", { ascending: true });

  if (error) {
    throw mapSupabaseErrorToAppError(error);
  }

  return assertZodParse(GetMealTagsResponseSchema, { data: data || [], count: count || 0 });
}
