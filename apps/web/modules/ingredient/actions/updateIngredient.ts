"use server";

import { PATHS } from "@/constants";
import { assertZodParse, getUserScopedQuery, mapSupabaseErrorToAppError } from "@/utils";
import {
  IngredientSchema,
  type UpdateIngredientPayload,
  UpdateIngredientPayloadSchema,
  type UpdateIngredientResponse,
} from "@repo/schemas";
import { revalidatePath } from "next/cache";

export async function updateIngredient(
  payload: UpdateIngredientPayload
): Promise<UpdateIngredientResponse> {
  const validatedPayload = assertZodParse(UpdateIngredientPayloadSchema, payload);

  const { user, supabase } = await getUserScopedQuery();

  const { data, error } = await supabase
    .from("ingredients")
    .update(validatedPayload)
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
