"use server";

import { assertZodParse, getUserScopedQuery, mapSupabaseErrorToAppError } from "@/utils";
import {
  type DeleteIngredientGroupPayload,
  DeleteIngredientGroupPayloadSchema,
  type DeleteIngredientGroupResponse,
  IngredientGroupSchema,
} from "@repo/schemas";
import { revalidatePath } from "next/cache";

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

  revalidatePath("/dashboard/library");

  return assertZodParse(IngredientGroupSchema, data);
}
