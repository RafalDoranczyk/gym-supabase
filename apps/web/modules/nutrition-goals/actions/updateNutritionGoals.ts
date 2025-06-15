import { getUserScopedQuery, mapSupabaseErrorToAppError } from "@/core/supabase";
import { assertZodParse } from "@/utils";
import {
  NutritionGoalsSchema,
  UpdateNutritionGoalsPayloadSchema,
  type UpdateNutritionGoalsPayload,
  type UpdateNutritionGoalsResponse,
} from "../schemas";

export async function updateNutritionGoals(
  payload: UpdateNutritionGoalsPayload
): Promise<UpdateNutritionGoalsResponse> {
  const validatedPayload = assertZodParse(UpdateNutritionGoalsPayloadSchema, payload);

  const { supabase, user } = await getUserScopedQuery();

  const { data, error } = await supabase
    .from("fitness_goals")
    .update({
      ...validatedPayload,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    throw mapSupabaseErrorToAppError(error);
  }

  return assertZodParse(NutritionGoalsSchema, data);
}
