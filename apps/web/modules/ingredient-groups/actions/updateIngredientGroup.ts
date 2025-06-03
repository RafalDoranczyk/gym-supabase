"use server";

import { assertZodParse, getUserScopedQuery, mapSupabaseErrorToAppError } from "@/utils";
import {
  NutritionGroupSchema,
  type UpdateNutritionGroupPayload,
  type UpdateNutritionGroupResponse,
} from "@repo/schemas";
import { revalidatePath } from "next/cache";

export async function updateIngredientGroup(
  payload: UpdateNutritionGroupPayload,
): Promise<UpdateNutritionGroupResponse> {
  const { user, supabase } = await getUserScopedQuery();

  const { data, error } = await supabase
    .from("ingredient_groups")
    .update(payload)
    .eq("id", payload.id)
    .eq("user_id", user.id)
    .select("*")
    .single();

  if (error) {
    throw mapSupabaseErrorToAppError(error);
  }

  revalidatePath("/dashboard/data-management");

  return assertZodParse(NutritionGroupSchema, data);
}
