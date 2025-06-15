"use server";

import { PATHS } from "@/constants";
import { getUserScopedQuery, mapSupabaseErrorToAppError } from "@/core/supabase";
import { assertZodParse } from "@/utils";
import {
  type CreateIngredientPayload,
  CreateIngredientPayloadSchema,
  type CreateIngredientResponse,
  IngredientSchema,
} from "@repo/schemas";
import { revalidatePath } from "next/cache";

export async function createIngredient(
  payload: CreateIngredientPayload
): Promise<CreateIngredientResponse> {
  const validatedPayload = assertZodParse(CreateIngredientPayloadSchema, payload);

  const { user, supabase } = await getUserScopedQuery();

  const { data, error } = await supabase
    .from("ingredients")
    .insert([{ ...validatedPayload, user_id: user.id }])
    .select("*")
    .single();

  if (error) {
    throw mapSupabaseErrorToAppError(error);
  }

  revalidatePath(PATHS.LIBRARY.INGREDIENTS);

  return assertZodParse(IngredientSchema, data);
}

// Setup version
export async function createIngredientForSetup(
  payload: CreateIngredientPayload
): Promise<CreateIngredientResponse> {
  const validatedPayload = assertZodParse(CreateIngredientPayloadSchema, payload);

  const { user, supabase } = await getUserScopedQuery();

  const { data, error } = await supabase
    .from("ingredients")
    .insert([{ ...validatedPayload, user_id: user.id }])
    .select("*")
    .single();

  if (error) {
    throw mapSupabaseErrorToAppError(error);
  }

  return assertZodParse(IngredientSchema, data);
}
