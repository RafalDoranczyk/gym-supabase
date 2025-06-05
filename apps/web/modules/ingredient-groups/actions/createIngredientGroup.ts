"use server";

import { assertZodParse, getUserScopedQuery, mapSupabaseErrorToAppError } from "@/utils";
import {
  type CreateIngredientGroupPayload,
  CreateIngredientGroupPayloadSchema,
  type CreateIngredientGroupResponse,
  IngredientGroupSchema,
} from "@repo/schemas";
import { revalidatePath } from "next/cache";

export async function createIngredientGroup(
  payload: CreateIngredientGroupPayload
): Promise<CreateIngredientGroupResponse> {
  const validatedPayload = assertZodParse(CreateIngredientGroupPayloadSchema, payload);

  const { user, supabase } = await getUserScopedQuery();

  const { data, error } = await supabase
    .from("ingredient_groups")
    .insert([{ ...validatedPayload, user_id: user.id }])
    .select("*")
    .single();

  if (error) {
    throw mapSupabaseErrorToAppError(error);
  }

  revalidatePath("/dashboard/library");

  return assertZodParse(IngredientGroupSchema, data);
}
