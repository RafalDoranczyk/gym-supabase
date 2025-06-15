"use server";

import { getUserScopedQuery, mapSupabaseErrorToAppError } from "@/core/supabase";
import { assertZodParse } from "@/utils";
import { type FetchMeasurementsResponse, FetchMeasurementsResponseSchema } from "@repo/schemas";

export async function fetchMeasurements(): Promise<FetchMeasurementsResponse> {
  const { user, supabase } = await getUserScopedQuery();

  const { count, data, error } = await supabase
    .from("measurements")
    .select("*, measurement_type:measurement_types(*)", { count: "exact" })
    .eq("user_id", user.id)
    .order("measured_at", { ascending: false });

  if (error) {
    throw mapSupabaseErrorToAppError(error);
  }

  return assertZodParse(FetchMeasurementsResponseSchema, {
    count,
    data,
  });
}
