"use server";

import { PATHS } from "@/constants";
import { getUserScopedQuery, mapSupabaseErrorToAppError } from "@/core/supabase";
import { assertZodParse } from "@/utils";
import { revalidatePath } from "next/cache";
import {
  IngredientSchema,
  type UpdateIngredientPayload,
  UpdateIngredientPayloadSchema,
  type UpdateIngredientResponse,
} from "../schemas";

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
