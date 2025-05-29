import { z } from "zod";

import { CreatedAt, MacroNumber, SupabaseId } from "../shared";
import { validationMessages } from "../shared/validationMessages";
import { INGREDIENT_NAME_MAX_LENGTH, INGREDIENT_NAME_MIN_LENGTH } from "./const";
import { INGREDIENT_UNIT_TYPES, type IngredientUnitType } from "./enums";

// Base ingredient schema (used for create/update payloads)
export const BaseIngredientSchema = z.object({
  calories: MacroNumber,
  carbs: MacroNumber,
  fat: MacroNumber,
  group_id: SupabaseId,
  name: z
    .string()
    .min(INGREDIENT_NAME_MIN_LENGTH, {
      message: validationMessages.string.min("Name", INGREDIENT_NAME_MIN_LENGTH),
    })
    .max(INGREDIENT_NAME_MAX_LENGTH, {
      message: validationMessages.string.max("Name", INGREDIENT_NAME_MAX_LENGTH),
    }),
  price: z.coerce
    .number()
    .min(0, {
      message: validationMessages.number.min("Price", 0),
    })
    .optional(),
  protein: MacroNumber,
  unit_type: z.enum(
    Object.keys(INGREDIENT_UNIT_TYPES) as [IngredientUnitType, ...IngredientUnitType[]],
    {
      message: validationMessages.enum("Unit type", INGREDIENT_UNIT_TYPES),
    },
  ),
});

// Full ingredient from DB
export const IngredientSchema = BaseIngredientSchema.extend({
  created_at: CreatedAt,
  id: SupabaseId,
  user_id: SupabaseId,
});
export type Ingredient = z.infer<typeof IngredientSchema>;

// Get all
export const GetIngredientsResponseSchema = z.object({
  count: z.number(),
  data: z.array(IngredientSchema),
});
export type GetIngredientsResponse = z.infer<typeof GetIngredientsResponseSchema>;

// Create
export const CreateIngredientPayloadSchema = BaseIngredientSchema;
export type CreateIngredientPayload = z.infer<typeof CreateIngredientPayloadSchema>;
export type CreateIngredientResponse = z.infer<typeof IngredientSchema>;

// Update
const UpdateIngredientPayloadSchema = BaseIngredientSchema.extend({
  id: SupabaseId,
});
export type UpdateIngredientPayload = z.infer<typeof UpdateIngredientPayloadSchema>;
export type UpdateIngredientResponse = z.infer<typeof IngredientSchema>;

// Remove
const RemoveIngredientPayloadSchema = SupabaseId;
export type RemoveIngredientPayload = z.infer<typeof RemoveIngredientPayloadSchema>;
export type RemoveIngredientResponse = z.infer<typeof IngredientSchema>;
