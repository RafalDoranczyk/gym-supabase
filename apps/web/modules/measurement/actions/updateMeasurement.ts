"use server";

import { PATHS } from "@/constants";
import { assertZodParse, getUserScopedQuery, mapSupabaseErrorToAppError } from "@/utils";
import {
  MeasurementSchema,
  UpdateMeasurementPayloadSchema,
  type UpdateMeasurementPayload,
  type UpdateMeasurementResponse,
} from "@repo/schemas";
import { revalidatePath } from "next/cache";

export async function updateMeasurement(
  payload: UpdateMeasurementPayload
): Promise<UpdateMeasurementResponse> {
  const validatedPayload = assertZodParse(UpdateMeasurementPayloadSchema, payload);

  const { user, supabase } = await getUserScopedQuery();

  const { data, error } = await supabase
    .from("measurements")
    .update(validatedPayload)
    .eq("id", validatedPayload.id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    throw mapSupabaseErrorToAppError(error);
  }

  revalidatePath(PATHS.MEASUREMENTS);

  return assertZodParse(MeasurementSchema, data);
}
