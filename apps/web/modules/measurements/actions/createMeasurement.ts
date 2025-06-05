"use server";

import { assertZodParse, getUserScopedQuery, mapSupabaseErrorToAppError } from "@/utils";
import {
  BasicMeasurementSchema,
  type CreateMeasurementPayload,
  CreateMeasurementPayloadSchema,
  type CreateMeasurementResponse,
  type CreateMeasurementsPayload,
  CreateMeasurementsPayloadSchema,
  type CreateMeasurementsResponse,
} from "@repo/schemas";
import { revalidatePath } from "next/cache";

export async function createMeasurement(
  payload: CreateMeasurementPayload
): Promise<CreateMeasurementResponse> {
  const validatedPayload = assertZodParse(CreateMeasurementPayloadSchema, payload);

  const { user, supabase } = await getUserScopedQuery();

  const { data, error } = await supabase
    .from("measurements")
    .insert({
      ...validatedPayload,
      user_id: user.id,
    })
    .select()
    .single();

  if (error) {
    throw mapSupabaseErrorToAppError(error);
  }

  return assertZodParse(BasicMeasurementSchema, data);
}

// Bulk create measurements (useful for importing data)
export async function createMeasurements(
  payload: CreateMeasurementsPayload
): Promise<CreateMeasurementsResponse> {
  const validatedPayload = assertZodParse(CreateMeasurementsPayloadSchema, payload);

  const { user, supabase } = await getUserScopedQuery();

  const { data, error } = await supabase
    .from("measurements")
    .insert(
      validatedPayload.measurements.map((measurement) => ({
        ...measurement,
        user_id: user.id,
      }))
    )
    .select();

  if (error) {
    throw mapSupabaseErrorToAppError(error);
  }

  revalidatePath("/dashboard/measurements");

  return data.map((measurement) => assertZodParse(BasicMeasurementSchema, measurement));
}
