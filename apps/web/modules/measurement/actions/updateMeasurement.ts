"use server";

import { PATHS } from "@/constants";
import { getUserScopedQuery, mapSupabaseErrorToAppError } from "@/core/supabase";
import { assertZodParse } from "@/utils";
import { revalidatePath } from "next/cache";
import {
  MeasurementSchema,
  UpdateMeasurementPayloadSchema,
  type UpdateMeasurementPayload,
  type UpdateMeasurementResponse,
} from "../schemas";

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
