"use server";

import { getUser } from "@/actions";
import { assertZodParse, createServerClient, mapSupabaseErrorToAppError } from "@/utils";
import {
  IngredientSchema,
  type RemoveIngredientPayload,
  type RemoveIngredientResponse,
} from "@repo/schemas";
import { revalidatePath } from "next/cache";

export async function deleteIngredient(
  id: RemoveIngredientPayload,
): Promise<RemoveIngredientResponse> {
  const user = await getUser();
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from("ingredients")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)
    .select("*")
    .single();

  if (error) {
    throw mapSupabaseErrorToAppError(error);
  }

  const ingredient = assertZodParse(IngredientSchema, data);

  revalidatePath("/dashboard/ingredients");

  return ingredient;
}
