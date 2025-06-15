"use server";

import { createSupabase, mapSupabaseErrorToAppError } from "@/core/supabase";
import { assertZodParse } from "@/utils";
import {
  FetchMeasurementTypesResponseSchema,
  type FetchMeasurementTypesResponse,
} from "@repo/schemas";

export async function fetchMeasurementTypes(): Promise<FetchMeasurementTypesResponse> {
  const supabase = await createSupabase();

  const { data, error, count } = await supabase
    .from("measurement_types")
    .select("*", { count: "exact" })
    .order("display_order", { ascending: true });

  if (error) {
    throw mapSupabaseErrorToAppError(error);
  }

  return assertZodParse(FetchMeasurementTypesResponseSchema, {
    data,
    count,
  });
}
