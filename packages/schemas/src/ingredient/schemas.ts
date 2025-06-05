import { z } from "zod";

import { CreatedAt, SupabaseId } from "../shared";
import { validationMessages } from "../shared/validationMessages";
import {
  INGREDIENT_DESCRIPTION_MAX_LENGTH,
  INGREDIENT_NAME_MAX_LENGTH,
  INGREDIENT_NAME_MIN_LENGTH,
  INGREDIENT_NUTRITION_MAX,
  INGREDIENT_NUTRITION_MIN,
  INGREDIENT_PRICE_MAX,
  INGREDIENT_UNIT_TYPES,
} from "./constants";

// ========================================
// Types & Schemas
// ========================================

export type IngredientUnitType = keyof typeof INGREDIENT_UNIT_TYPES;

// Helper schema for nutrition values - reduces repetition
const NutritionValueSchema = z.coerce
  .number()
  .min(INGREDIENT_NUTRITION_MIN)
  .max(INGREDIENT_NUTRITION_MAX);

export const IngredientUnitTypeSchema = z.enum(
  Object.keys(INGREDIENT_UNIT_TYPES) as [IngredientUnitType, ...IngredientUnitType[]],
  {
    message: validationMessages.enum("Unit type", INGREDIENT_UNIT_TYPES),
  }
);

export const IngredientFormSchema = z.object({
  name: z
    .string()
    .min(INGREDIENT_NAME_MIN_LENGTH, {
      message: validationMessages.string.min("Name", INGREDIENT_NAME_MIN_LENGTH),
    })
    .max(INGREDIENT_NAME_MAX_LENGTH, {
      message: validationMessages.string.max("Name", INGREDIENT_NAME_MAX_LENGTH),
    }),
  description: z
    .string()
    .max(INGREDIENT_DESCRIPTION_MAX_LENGTH, {
      message: validationMessages.string.max("Description", INGREDIENT_DESCRIPTION_MAX_LENGTH),
    })
    .optional(),
  unit_type: IngredientUnitTypeSchema,
  group_id: SupabaseId,
  // Nutrition values
  calories: NutritionValueSchema.refine((val) => val >= INGREDIENT_NUTRITION_MIN, {
    message: validationMessages.number.min("Calories", INGREDIENT_NUTRITION_MIN),
  }),
  protein: NutritionValueSchema.refine((val) => val >= INGREDIENT_NUTRITION_MIN, {
    message: validationMessages.number.min("Protein", INGREDIENT_NUTRITION_MIN),
  }),
  carbs: NutritionValueSchema.refine((val) => val >= INGREDIENT_NUTRITION_MIN, {
    message: validationMessages.number.min("Carbs", INGREDIENT_NUTRITION_MIN),
  }),
  fat: NutritionValueSchema.refine((val) => val >= INGREDIENT_NUTRITION_MIN, {
    message: validationMessages.number.min("Fat", INGREDIENT_NUTRITION_MIN),
  }),
  // Optional fields
  price: z.coerce
    .number()
    .min(0, {
      message: validationMessages.number.min("Price", 0),
    })
    .max(INGREDIENT_PRICE_MAX, {
      message: validationMessages.number.max("Price", INGREDIENT_PRICE_MAX),
    })
    .optional(),
});

export const IngredientSchema = IngredientFormSchema.extend({
  id: SupabaseId,
  user_id: SupabaseId,
  created_at: CreatedAt,
});

// ========================================
// API Schemas
// ========================================

export const FetchIngredientsPayloadSchema = z.object({
  group: z.string().optional(),
  search: z.string().optional(),
  limit: z.coerce.number().min(1).max(100).optional(),
  offset: z.coerce.number().min(0).optional(),
  order: z.enum(["asc", "desc"]).optional(),
  orderBy: z.enum(["name", "calories", "price", "created_at"]).optional(),
});

export const FetchIngredientsResponseSchema = z.object({
  count: z.number(),
  data: z.array(IngredientSchema),
});

export const CreateIngredientPayloadSchema = IngredientFormSchema;

export const UpdateIngredientPayloadSchema = IngredientFormSchema.extend({
  id: SupabaseId,
});

export const DeleteIngredientPayloadSchema = z.object({
  id: SupabaseId,
});

// ========================================
// Types
// ========================================

export type Ingredient = z.infer<typeof IngredientSchema>;

// API Types
export type FetchIngredientsPayload = z.infer<typeof FetchIngredientsPayloadSchema>;
export type FetchIngredientsResponse = z.infer<typeof FetchIngredientsResponseSchema>;

// CRUD Types
export type CreateIngredientPayload = z.infer<typeof CreateIngredientPayloadSchema>;
export type UpdateIngredientPayload = z.infer<typeof UpdateIngredientPayloadSchema>;
export type DeleteIngredientPayload = z.infer<typeof DeleteIngredientPayloadSchema>;

// Response types
export type CreateIngredientResponse = Ingredient;
export type UpdateIngredientResponse = Ingredient;
export type DeleteIngredientResponse = Ingredient;
