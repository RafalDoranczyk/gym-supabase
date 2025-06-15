"use server";

import { PATHS } from "@/constants";
import { getUserScopedQuery, mapSupabaseErrorToAppError } from "@/core/supabase";
import { assertZodParse } from "@/utils";
import { revalidatePath } from "next/cache";
import {
  type DeleteIngredientGroupPayload,
  DeleteIngredientGroupPayloadSchema,
  type DeleteIngredientGroupResponse,
  IngredientGroupSchema,
} from "../schemas";

export async function deleteIngredientGroup(
  payload: DeleteIngredientGroupPayload
): Promise<DeleteIngredientGroupResponse> {
  const validatedId = assertZodParse(DeleteIngredientGroupPayloadSchema, payload);

  const { user, supabase } = await getUserScopedQuery();

  const { data, error } = await supabase
    .from("ingredient_groups")
    .delete()
    .eq("id", validatedId.id)
    .eq("user_id", user.id)
    .select("*")
    .single();

  if (error) {
    throw mapSupabaseErrorToAppError(error);
  }

  revalidatePath(PATHS.LIBRARY.ROOT);

  return assertZodParse(IngredientGroupSchema, data);
}
