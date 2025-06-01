"use server";

import { assertZodParse, mapSupabaseErrorToAppError, DB_TABLES, getUserScopedQuery } from "@/utils";

import {
  IngredientSchema,
  type DeleteIngredientPayload,
  type DeleteIngredientResponse,
} from "@repo/schemas";
import { revalidatePath } from "next/cache";

export async function deleteIngredient(
  payload: DeleteIngredientPayload,
): Promise<DeleteIngredientResponse> {
  const { user, supabase } = await getUserScopedQuery();

  const { data, error } = await supabase
    .from(DB_TABLES.INGREDIENTS)
    .delete()
    .eq("id", payload)
    .eq("user_id", user.id)
    .select("*")
    .single();

  if (error) {
    throw mapSupabaseErrorToAppError(error);
  }

  revalidatePath("/dashboard/ingredients");

  return assertZodParse(IngredientSchema, data);
}
