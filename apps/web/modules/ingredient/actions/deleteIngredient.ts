"use server";

import { PATHS } from "@/constants";
import { getUserScopedQuery, mapSupabaseErrorToAppError } from "@/core/supabase";
import { assertZodParse } from "@/utils";

import {
  type DeleteIngredientPayload,
  DeleteIngredientPayloadSchema,
  type DeleteIngredientResponse,
  IngredientSchema,
} from "@repo/schemas";
import { revalidatePath } from "next/cache";

export async function deleteIngredient(
  payload: DeleteIngredientPayload
): Promise<DeleteIngredientResponse> {
  const validatedPayload = assertZodParse(DeleteIngredientPayloadSchema, payload);

  const { user, supabase } = await getUserScopedQuery();

  const { data, error } = await supabase
    .from("ingredients")
    .delete()
    .eq("id", validatedPayload.id)
    .eq("user_id", user.id)
    .select("*")
    .single();

  if (error) {
    throw mapSupabaseErrorToAppError(error);
  }

  revalidatePath(PATHS.LIBRARY.INGREDIENTS);

  return assertZodParse(IngredientSchema, data);
}
