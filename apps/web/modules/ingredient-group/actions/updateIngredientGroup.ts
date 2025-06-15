"use server";

import { PATHS } from "@/constants";
import { getUserScopedQuery, mapSupabaseErrorToAppError } from "@/core/supabase";
import { assertZodParse } from "@/utils";
import { revalidatePath } from "next/cache";
import {
  IngredientGroupSchema,
  UpdateIngredientGroupPayloadSchema,
  type UpdateIngredientGroupPayload,
  type UpdateIngredientGroupResponse,
} from "../schemas";

export async function updateIngredientGroup(
  payload: UpdateIngredientGroupPayload
): Promise<UpdateIngredientGroupResponse> {
  const validatedPayload = assertZodParse(UpdateIngredientGroupPayloadSchema, payload);

  const { user, supabase } = await getUserScopedQuery();

  const { data, error } = await supabase
    .from("ingredient_groups")
    .update(validatedPayload)
    .eq("id", validatedPayload.id)
    .eq("user_id", user.id)
    .select("*")
    .single();

  if (error) {
    throw mapSupabaseErrorToAppError(error);
  }

  revalidatePath(PATHS.LIBRARY.ROOT);

  return assertZodParse(IngredientGroupSchema, data);
}
