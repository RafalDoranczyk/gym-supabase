"use server";

import { createSupabase, getUserScopedQuery, mapSupabaseErrorToAppError } from "@/core/supabase";
import { assertZodParse } from "@/utils";
import {
  type FetchMeasurementsResponse,
  FetchMeasurementsResponseSchema,
  type FetchMeasurementTypesResponse,
  FetchMeasurementTypesResponseSchema,
} from "../schemas";

export async function fetchMeasurements(): Promise<FetchMeasurementsResponse> {
  const { user, supabase } = await getUserScopedQuery();

  const { count, data, error } = await supabase
    .from("measurements")
    .select("*, measurement_type:measurement_types(*)", { count: "exact" })
    .eq("user_id", user.id)
    .order("measured_at", { ascending: false });

  if (error) {
    throw mapSupabaseErrorToAppError(error);
  }

  return assertZodParse(FetchMeasurementsResponseSchema, {
    count,
    data,
  });
}

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
