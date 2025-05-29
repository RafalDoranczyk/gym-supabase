"use server";

import { getUser } from "@/actions";
import { assertZodParse, createServerClient, mapSupabaseErrorToAppError } from "@/utils";
import {
  IngredientSchema,
  type UpdateIngredientPayload,
  type UpdateIngredientResponse,
} from "@repo/schemas";
import { revalidatePath } from "next/cache";

export async function updateIngredient(
  payload: UpdateIngredientPayload,
): Promise<UpdateIngredientResponse> {
  const user = await getUser();
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from("ingredients")
    .update(payload)
    .eq("id", payload.id)
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
