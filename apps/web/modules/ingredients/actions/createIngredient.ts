"use server";

import { DB_TABLES, assertZodParse, getUserScopedQuery, mapSupabaseErrorToAppError } from "@/utils";

import {
  type CreateIngredientPayload,
  type CreateIngredientResponse,
  IngredientSchema,
} from "@repo/schemas";
import { revalidatePath } from "next/cache";

export async function createIngredient(
  payload: CreateIngredientPayload,
): Promise<CreateIngredientResponse> {
  const { user, supabase } = await getUserScopedQuery();

  const { data, error } = await supabase
    .from(DB_TABLES.INGREDIENTS)
    .insert([{ ...payload, user_id: user.id }])
    .select("*")
    .single();

  if (error) {
    throw mapSupabaseErrorToAppError(error);
  }

  revalidatePath("/dashboard/ingredients");

  return assertZodParse(IngredientSchema, data);
}
