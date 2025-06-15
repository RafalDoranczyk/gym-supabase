import { CreatedAt, SupabaseId, validationMessages } from "@/schemas/shared";
import { z } from "zod";
import {
  INGREDIENT_DESCRIPTION_MAX_LENGTH,
  INGREDIENT_NAME_MAX_LENGTH,
  INGREDIENT_NAME_MIN_LENGTH,
  INGREDIENT_NUTRITION_MAX,
  INGREDIENT_NUTRITION_MIN,
  INGREDIENT_PRICE_MAX,
  INGREDIENT_UNIT_TYPES,
  INGREDIENTS_MAX_PAGE_SIZE,
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

// Nutrition fields schema for better organization
const NutritionFieldsSchema = z.object({
  calories: NutritionValueSchema,
  protein: NutritionValueSchema,
  carbs: NutritionValueSchema,
  fat: NutritionValueSchema,
});

// Main ingredient schema - single source of truth
export const IngredientSchema = z
  .object({
    id: SupabaseId,
    user_id: SupabaseId,
    created_at: CreatedAt,
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
    price: z.coerce
      .number()
      .min(0, {
        message: validationMessages.number.min("Price", 0),
      })
      .max(INGREDIENT_PRICE_MAX, {
        message: validationMessages.number.max("Price", INGREDIENT_PRICE_MAX),
      })
      .optional(),
  })
  .merge(NutritionFieldsSchema);

// ========================================
// API Schemas - derived from main schema
// ========================================

export const CreateIngredientPayloadSchema = IngredientSchema.omit({
  id: true,
  user_id: true,
  created_at: true,
});

export const UpdateIngredientPayloadSchema = IngredientSchema.omit({
  user_id: true,
  created_at: true,
});

export const DeleteIngredientPayloadSchema = z.object({
  id: SupabaseId,
});

export const FetchIngredientsPayloadSchema = z.object({
  group: z.string().optional(),
  search: z.string().optional(),
  limit: z.coerce.number().min(1).max(INGREDIENTS_MAX_PAGE_SIZE).optional(),
  offset: z.coerce.number().min(0).optional(),
  order: z.enum(["asc", "desc"]).optional(),
  orderBy: z
    .enum(["name", "calories", "protein", "carbs", "fat", "price", "created_at"])
    .optional(),
});

export const FetchIngredientsResponseSchema = z.object({
  count: z.number(),
  data: z.array(IngredientSchema),
});

// ========================================
// UI-specific schemas - new, local for this module
// ========================================

export const IngredientFiltersSchema = z.object({
  search: z.string().optional(),
  group: z.string().optional(),
  orderBy: z.string().optional(),
  order: z.enum(["asc", "desc"]).optional(),
  offset: z.coerce.number().optional(),
  limit: z.coerce.number().optional(),
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

// Form Types
export type IngredientFormData = CreateIngredientPayload & { id?: string };

// UI Types - new, local
export type IngredientFilters = z.infer<typeof IngredientFiltersSchema>;
