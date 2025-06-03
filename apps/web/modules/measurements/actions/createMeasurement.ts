"use server";

import { assertZodParse, getUserScopedQuery, mapSupabaseErrorToAppError } from "@/utils";
import {
  type CreateMeasurement,
  CreateMeasurementSchema,
  type Measurement,
  MeasurementSchema,
} from "@repo/schemas";

export async function createMeasurement(payload: CreateMeasurement): Promise<Measurement> {
  const { user, supabase } = await getUserScopedQuery();

  const { data, error } = await supabase
    .from("measurements")
    .insert({
      ...payload,
      user_id: user.id,
    })
    .select()
    .single();

  if (error) {
    throw mapSupabaseErrorToAppError(error);
  }

  return assertZodParse(MeasurementSchema, data);
}

// Bulk create measurements (useful for importing data)
export async function createMeasurements(inputs: CreateMeasurement[]): Promise<Measurement[]> {
  const { user, supabase } = await getUserScopedQuery();

  // Validate all inputs
  const validatedData = inputs.map((input) => assertZodParse(CreateMeasurementSchema, input));

  // Insert measurements
  const { data, error } = await supabase
    .from("measurements")
    .insert(
      validatedData.map((measurement) => ({
        ...measurement,
        user_id: user.id,
      })),
    )
    .select();

  if (error) {
    throw mapSupabaseErrorToAppError(error);
  }

  return data.map((measurement) => assertZodParse(MeasurementSchema, measurement));
}
