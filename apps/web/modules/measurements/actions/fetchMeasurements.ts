"use server";

import { DB_TABLES, assertZodParse, getUserScopedQuery, mapSupabaseErrorToAppError } from "@/utils";
import { type GetMeasurementsResponse, GetMeasurementsResponseSchema } from "@repo/schemas";

export async function fetchMeasurements(): Promise<GetMeasurementsResponse> {
  const { user, supabase } = await getUserScopedQuery();

  const { count, data, error } = await supabase
    .from(DB_TABLES.MEASUREMENTS)
    .select(
      `
      *,
      measurement_type:measurement_types(*)
    `,
      { count: "exact" },
    )
    .eq("user_id", user.id)
    .order("measured_at", { ascending: false });

  if (error) {
    throw mapSupabaseErrorToAppError(error);
  }

  return assertZodParse(GetMeasurementsResponseSchema, {
    count: count ?? 0,
    data: data ?? [],
  });
}
