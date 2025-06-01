"use server";

import { assertZodParse, DB_TABLES, getUserScopedQuery, mapSupabaseErrorToAppError } from "@/utils";
import {
  IngredientSchema,
  type UpdateIngredientPayload,
  type UpdateIngredientResponse,
} from "@repo/schemas";
import { revalidatePath } from "next/cache";

export async function updateIngredient(
  payload: UpdateIngredientPayload,
): Promise<UpdateIngredientResponse> {
  const { user, supabase } = await getUserScopedQuery();

  const { data, error } = await supabase
    .from(DB_TABLES.INGREDIENTS)
    .update(payload)
    .eq("id", payload.id)
    .eq("user_id", user.id)
    .select("*")
    .single();

  if (error) {
    throw mapSupabaseErrorToAppError(error);
  }

  revalidatePath("/dashboard/ingredients");

  return assertZodParse(IngredientSchema, data);
}
