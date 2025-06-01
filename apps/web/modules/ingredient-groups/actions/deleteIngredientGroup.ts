"use server";

import { DB_TABLES, assertZodParse, getUserScopedQuery, mapSupabaseErrorToAppError } from "@/utils";
import {
  type DeleteNutritionGroupPayload,
  type DeleteNutritionGroupResponse,
  NutritionGroupSchema,
} from "@repo/schemas";
import { revalidatePath } from "next/cache";

export async function deleteIngredientGroup(
  id: DeleteNutritionGroupPayload,
): Promise<DeleteNutritionGroupResponse> {
  const { user, supabase } = await getUserScopedQuery();

  const { data, error } = await supabase
    .from(DB_TABLES.INGREDIENT_GROUPS)
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)
    .select("*")
    .single();

  if (error) {
    throw mapSupabaseErrorToAppError(error);
  }

  revalidatePath("/dashboard/data-management");

  return assertZodParse(NutritionGroupSchema, data);
}
