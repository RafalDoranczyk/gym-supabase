"use server";

import { DB_TABLES, assertZodParse, getUserScopedQuery, mapSupabaseErrorToAppError } from "@/utils";
import {
  IngredientSchema,
  type UpdateIngredientPayload,
  UpdateIngredientPayloadSchema,
  type UpdateIngredientResponse,
} from "@repo/schemas";
import { revalidatePath } from "next/cache";

export async function updateIngredient(
  payload: UpdateIngredientPayload,
): Promise<UpdateIngredientResponse> {
  // Validate input - security boundary
  const validatedPayload = assertZodParse(UpdateIngredientPayloadSchema, payload);

  const { user, supabase } = await getUserScopedQuery();

  const { data, error } = await supabase
    .from(DB_TABLES.INGREDIENTS)
    .update(validatedPayload)
    .eq("id", validatedPayload.id)
    .eq("user_id", user.id)
    .select("*")
    .single();

  if (error) {
    throw mapSupabaseErrorToAppError(error);
  }

  revalidatePath("/dashboard/ingredients");

  // Validate output - ensure type safety
  return assertZodParse(IngredientSchema, data);
}
