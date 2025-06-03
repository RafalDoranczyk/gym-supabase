"use server";

import { DB_TABLES, assertZodParse, getUserScopedQuery, mapSupabaseErrorToAppError } from "@/utils";
import { type Measurement, MeasurementSchema, type UpdateMeasurement } from "@repo/schemas";

export async function updateMeasurement(
  id: string,
  payload: UpdateMeasurement,
): Promise<Measurement> {
  const { user, supabase } = await getUserScopedQuery();

  const { data, error } = await supabase
    .from(DB_TABLES.MEASUREMENTS)
    .update(payload)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    throw mapSupabaseErrorToAppError(error);
  }

  return assertZodParse(MeasurementSchema, data);
}
