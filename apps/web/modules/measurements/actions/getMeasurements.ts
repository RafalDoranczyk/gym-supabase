"use server";

import { assertZodParse, createServerClient, mapSupabaseErrorToAppError } from "@/utils";
import { type GetMeasurementsResponse, GetMeasurementsResponseSchema } from "@repo/schemas";

export async function getMeasurements(): Promise<GetMeasurementsResponse> {
  const supabase = await createServerClient();

  const { count, data, error } = await supabase
    .from("measurements")
    .select("*", { count: "exact" });

  if (error) {
    throw mapSupabaseErrorToAppError(error);
  }

  const parsed = assertZodParse(GetMeasurementsResponseSchema, {
    count,
    data,
  });

  return parsed;
}
