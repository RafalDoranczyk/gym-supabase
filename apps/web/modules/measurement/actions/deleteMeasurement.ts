"use server";

import { PATHS } from "@/constants";
import { assertZodParse, getUserScopedQuery, mapSupabaseErrorToAppError } from "@/utils";
import {
  BasicMeasurementSchema,
  type DeleteMeasurementPayload,
  DeleteMeasurementPayloadSchema,
  type DeleteMeasurementResponse,
  type DeleteMeasurementsPayload,
  DeleteMeasurementsPayloadSchema,
} from "@repo/schemas";
import { revalidatePath } from "next/cache";

export async function deleteMeasurement(
  payload: DeleteMeasurementPayload
): Promise<DeleteMeasurementResponse> {
  const validatedPayload = assertZodParse(DeleteMeasurementPayloadSchema, payload);

  const { user, supabase } = await getUserScopedQuery();

  const { error, data } = await supabase
    .from("measurements")
    .delete()
    .eq("id", validatedPayload.id)
    .eq("user_id", user.id)
    .select("*")
    .single();

  if (error) {
    throw mapSupabaseErrorToAppError(error);
  }

  revalidatePath(PATHS.MEASUREMENTS);

  return assertZodParse(BasicMeasurementSchema, data);
}

// Bulk delete measurements
export async function deleteMeasurements(payload: DeleteMeasurementsPayload): Promise<void> {
  const validatedPayload = assertZodParse(DeleteMeasurementsPayloadSchema, payload);
  const { user, supabase } = await getUserScopedQuery();

  if (validatedPayload.ids.length === 0) {
    throw new Error("At least one ID is required for bulk delete");
  }

  const { error } = await supabase
    .from("measurements")
    .delete()
    .in("id", validatedPayload.ids)
    .eq("user_id", user.id);

  if (error) {
    throw mapSupabaseErrorToAppError(error);
  }
}
