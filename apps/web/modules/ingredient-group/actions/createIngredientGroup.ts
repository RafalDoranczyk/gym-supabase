"use server";

import { PATHS } from "@/constants";
import { getUserScopedQuery, mapSupabaseErrorToAppError } from "@/core/supabase";
import { assertZodParse } from "@/utils";
import { revalidatePath } from "next/cache";
import {
  type CreateIngredientGroupPayload,
  CreateIngredientGroupPayloadSchema,
  type CreateIngredientGroupResponse,
  IngredientGroupSchema,
} from "../schemas";

export async function createIngredientGroup(
  payload: CreateIngredientGroupPayload
): Promise<CreateIngredientGroupResponse> {
  const validatedPayload = assertZodParse(CreateIngredientGroupPayloadSchema, payload);

  const { user, supabase } = await getUserScopedQuery();

  const { data, error } = await supabase
    .from("ingredient_groups")
    .insert([{ ...validatedPayload, user_id: user.id }])
    .select("*")
    .single();

  if (error) {
    throw mapSupabaseErrorToAppError(error);
  }

  revalidatePath(PATHS.LIBRARY.ROOT);

  return assertZodParse(IngredientGroupSchema, data);
}

export async function createIngredientGroupForSetup(payload: CreateIngredientGroupPayload) {
  const validatedPayload = assertZodParse(CreateIngredientGroupPayloadSchema, payload);
  const { user, supabase } = await getUserScopedQuery();

  const { data, error } = await supabase
    .from("ingredient_groups")
    .insert([{ ...validatedPayload, user_id: user.id }])
    .select("*")
    .single();

  if (error) {
    throw mapSupabaseErrorToAppError(error);
  }

  return assertZodParse(IngredientGroupSchema, data);
}
