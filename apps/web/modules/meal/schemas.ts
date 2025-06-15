import { CreatedAt, SupabaseId, validationMessages } from "@/schemas/shared";
import { z } from "zod";
import { IngredientSchema } from "../ingredient";
import { MealTagSchema, MealToTagSchema } from "../meal-tag";
import {
  MEAL_DESCRIPTION_MAX_LENGTH,
  MEAL_NAME_MAX_LENGTH,
  MEAL_NAME_MIN_LENGTH,
  MEALS_MAX_PAGE_SIZE,
} from "./constants";

// ========================================
// Helper Schemas
// ========================================

// Minimal Ingredient shape used inside MealIngredient (picked from full schema)
const MinimalIngredientSchema = IngredientSchema.pick({
  calories: true,
  carbs: true,
  fat: true,
  id: true,
  name: true,
  price: true,
  protein: true,
  unit_type: true,
});

// Ingredient used in meal with relationship data
const MealIngredientSchema = z.object({
  amount: z.number().positive({
    message: validationMessages.number.positive("Amount"),
  }),
  ingredient: MinimalIngredientSchema,
});

// ========================================
// Types & Schemas
// ========================================

// Main meal schema - single source of truth
export const MealSchema = z.object({
  id: SupabaseId,
  user_id: SupabaseId,
  created_at: CreatedAt,
  name: z
    .string()
    .min(MEAL_NAME_MIN_LENGTH, {
      message: validationMessages.string.min("Name", MEAL_NAME_MIN_LENGTH),
    })
    .max(MEAL_NAME_MAX_LENGTH, {
      message: validationMessages.string.max("Name", MEAL_NAME_MAX_LENGTH),
    })
    .transform((val) => val.trim()),
  description: z
    .string()
    .max(MEAL_DESCRIPTION_MAX_LENGTH, {
      message: validationMessages.string.max("Description", MEAL_DESCRIPTION_MAX_LENGTH),
    })
    .optional()
    .or(z.literal("")),
  meal_ingredients: z.array(MealIngredientSchema).optional(),
  meal_to_tags: z.array(MealToTagSchema).optional(),
});

// Extended schema for detailed view with populated relations
export const DetailedMealSchema = MealSchema.extend({
  meal_ingredients: z.array(MealIngredientSchema), // Required for detailed view
  tags: z.array(MealTagSchema), // Required for detailed view
});

// ========================================
// API Schemas - derived from main schema
// ========================================

export const CreateMealPayloadSchema = MealSchema.omit({
  id: true,
  user_id: true,
  created_at: true,
  meal_ingredients: true,
  meal_to_tags: true,
}).extend({
  ingredients: z
    .array(
      z.object({
        ingredient_id: SupabaseId,
        amount: z.number().positive({
          message: validationMessages.number.positive("Amount"),
        }),
      })
    )
    .min(1, {
      message: validationMessages.array.min("Ingredients", 1),
    }),
  tag_ids: z.array(SupabaseId).optional(),
});

export const UpdateMealPayloadSchema = CreateMealPayloadSchema.extend({
  id: SupabaseId,
});

export const DeleteMealPayloadSchema = z.object({
  id: SupabaseId,
});

export const FetchMealsPayloadSchema = z.object({
  search: z
    .string()
    .transform((val) => val.trim())
    .optional()
    .or(z.literal("")),
  tag: z.string().optional(),
  limit: z.coerce.number().min(1).max(MEALS_MAX_PAGE_SIZE).optional(),
  offset: z.coerce.number().min(0).optional(),
  order: z.enum(["asc", "desc"]).optional(),
  orderBy: z.enum(["name", "created_at"]).optional(),
});

export const FetchMealsResponseSchema = z.object({
  count: z.number(),
  data: z.array(MealSchema),
});

// ========================================
// Types
// ========================================

export type MealIngredient = z.infer<typeof MealIngredientSchema>;
export type Meal = z.infer<typeof MealSchema>;
export type DetailedMeal = z.infer<typeof DetailedMealSchema>;

// API Types
export type FetchMealsPayload = z.infer<typeof FetchMealsPayloadSchema>;
export type FetchMealsResponse = z.infer<typeof FetchMealsResponseSchema>;

// CRUD Types
export type CreateMealPayload = z.infer<typeof CreateMealPayloadSchema>;
export type UpdateMealPayload = z.infer<typeof UpdateMealPayloadSchema>;
export type DeleteMealPayload = z.infer<typeof DeleteMealPayloadSchema>;

// Response types
export type CreateMealResponse = Meal;
export type UpdateMealResponse = Meal;
export type DeleteMealResponse = Meal;

// Form Types
export type MealFormData = CreateMealPayload & { id?: string };
