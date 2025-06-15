"use server";

import { PATHS } from "@/constants";
import { getUserScopedQuery, mapSupabaseErrorToAppError } from "@/core/supabase";
import { assertZodParse } from "@/utils";
import { revalidatePath } from "next/cache";
import {
  type CreateMealTagPayload,
  CreateMealTagPayloadSchema,
  type CreateMealTagResponse,
  MealTagSchema,
} from "../schemas";

export async function createMealTag(payload: CreateMealTagPayload): Promise<CreateMealTagResponse> {
  const validatedPayload = assertZodParse(CreateMealTagPayloadSchema, payload);

  const { user, supabase } = await getUserScopedQuery();

  const { data, error } = await supabase
    .from("meal_tags")
    .insert([{ ...validatedPayload, user_id: user.id }])
    .select("*")
    .single();

  if (error) {
    throw mapSupabaseErrorToAppError(error);
  }

  revalidatePath(PATHS.LIBRARY.ROOT);

  return assertZodParse(MealTagSchema, data);
}

export async function createMealTagForSetup(
  payload: CreateMealTagPayload
): Promise<CreateMealTagResponse> {
  const validatedPayload = assertZodParse(CreateMealTagPayloadSchema, payload);

  const { user, supabase } = await getUserScopedQuery();

  const { data, error } = await supabase
    .from("meal_tags")
    .insert([{ ...validatedPayload, user_id: user.id }])
    .select("*")
    .single();

  if (error) {
    throw mapSupabaseErrorToAppError(error);
  }

  return assertZodParse(MealTagSchema, data);
}
