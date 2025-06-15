import { getUserScopedQuery, mapSupabaseErrorToAppError } from "@/core/supabase";
import { assertZodParse } from "@/utils";
import {
  CreateNutritionGoalsPayloadSchema,
  NutritionGoalsSchema,
  type CreateNutritionGoalsPayload,
  type CreateNutritionGoalsResponse,
} from "../schemas";

export async function createNutritionGoals(
  payload: CreateNutritionGoalsPayload
): Promise<CreateNutritionGoalsResponse> {
  const validatedPayload = assertZodParse(CreateNutritionGoalsPayloadSchema, payload);

  const { supabase, user } = await getUserScopedQuery();

  const { data, error } = await supabase
    .from("fitness_goals")
    .insert({
      user_id: user.id,
      ...validatedPayload,
    })
    .select()
    .single();

  if (error) {
    throw mapSupabaseErrorToAppError(error);
  }

  return assertZodParse(NutritionGoalsSchema, data);
}
