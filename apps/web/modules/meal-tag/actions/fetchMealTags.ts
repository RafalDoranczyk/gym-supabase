"use server";

import { getUserScopedQuery, mapSupabaseErrorToAppError } from "@/core/supabase";
import { assertZodParse } from "@/utils";
import { FetchMealTagsResponseSchema, type FetchMealTagsResponse } from "@repo/schemas";

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
