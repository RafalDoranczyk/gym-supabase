"use server";

import { PATHS } from "@/constants";
import { getUserScopedQuery, mapSupabaseErrorToAppError } from "@/core/supabase";
import { assertZodParse } from "@/utils";
import { revalidatePath } from "next/cache";
import {
  BasicMeasurementSchema,
  type DeleteMeasurementPayload,
  DeleteMeasurementPayloadSchema,
  type DeleteMeasurementResponse,
} from "../schemas";

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
