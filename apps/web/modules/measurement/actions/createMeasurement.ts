"use server";

import { PATHS } from "@/constants";
import { getUserScopedQuery, mapSupabaseErrorToAppError } from "@/core/supabase";
import { assertZodParse } from "@/utils";
import { revalidatePath } from "next/cache";
import {
  BasicMeasurementSchema,
  type CreateMeasurementPayload,
  CreateMeasurementPayloadSchema,
  type CreateMeasurementResponse,
} from "../schemas";

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

  revalidatePath(PATHS.MEASUREMENTS);

  return assertZodParse(BasicMeasurementSchema, data);
}
