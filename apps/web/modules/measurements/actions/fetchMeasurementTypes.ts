"use server";

import { assertZodParse, createServerClient, mapSupabaseErrorToAppError } from "@/utils";
import { MeasurementTypeSchema } from "@repo/schemas";
import { z } from "zod";

// Response schema for multiple measurement types
const GetMeasurementTypesResponseSchema = z.array(MeasurementTypeSchema);
export type GetMeasurementTypesResponse = z.infer<typeof GetMeasurementTypesResponseSchema>;

export async function fetchMeasurementTypes(): Promise<GetMeasurementTypesResponse> {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from("measurement_types")
    .select("*")
    .order("display_order", { ascending: true }); // Sort by display order

  if (error) {
    throw mapSupabaseErrorToAppError(error);
  }

  return assertZodParse(GetMeasurementTypesResponseSchema, data);
}
