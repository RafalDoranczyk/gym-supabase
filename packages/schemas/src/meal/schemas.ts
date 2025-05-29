import { z } from 'zod';

import { IngredientSchema } from '../ingredient';
import { MealTagSchema } from '../mealTag/schemas';
import { CreatedAt, SupabaseId, validationMessages } from '../shared';
import {
  MEAL_DESCRIPTION_MAX_LENGTH,
  MEAL_NAME_MAX_LENGTH,
  MEAL_NAME_MIN_LENGTH,
} from './consts';

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

// Ingredient used in meal
const MealIngredientSchema = z.object({
  amount: z.number().positive({
    message: validationMessages.number.positive('Amount'),
  }),
  ingredient: MinimalIngredientSchema,
});
export type MealIngredient = z.infer<typeof MealIngredientSchema>;

// Base meal schema (used for create/update payloads)
export const BaseMealSchema = z.object({
  description: z
    .string({
      message: validationMessages.string.max('Description', MEAL_DESCRIPTION_MAX_LENGTH),
    })
    .optional(),
  name: z
    .string()
    .min(MEAL_NAME_MIN_LENGTH, {
      message: validationMessages.string.min('Name', MEAL_NAME_MIN_LENGTH),
    })
    .max(MEAL_NAME_MAX_LENGTH, {
      message: validationMessages.string.max('Name', MEAL_NAME_MAX_LENGTH),
    }),
});

// Full meal schema with relations (from DB)
export const MealSchema = BaseMealSchema.extend({
  created_at: CreatedAt,
  id: SupabaseId,
  meal_ingredients: z.array(MealIngredientSchema),
  tags: z.array(MealTagSchema).optional(),
  user_id: SupabaseId,
});

export type Meal = z.infer<typeof MealSchema>;

// Create
export const CreateMealPayloadSchema = BaseMealSchema.extend({
  ingredients: z.array(
    z.object({
      amount: z.number().positive(),
      ingredient_id: SupabaseId,
    }),
  ),
});
export type CreateMealPayload = z.infer<typeof CreateMealPayloadSchema>;
export type CreateMealResponse = Meal;

// Update
export const UpdateMealPayloadSchema = CreateMealPayloadSchema.extend({
  id: SupabaseId,
});
export type UpdateMealPayload = z.infer<typeof UpdateMealPayloadSchema>;
export type UpdateMealResponse = Meal;

// Remove
export const RemoveMealPayloadSchema = z.object({
  id: SupabaseId,
});
export type RemoveMealPayload = z.infer<typeof RemoveMealPayloadSchema>;
export type RemoveMealResponse = Meal;

// Get many
export const GetMealsPayloadSchema = z.object({
  group: z.string().optional(),
});
export type GetMealsPayload = z.infer<typeof GetMealsPayloadSchema>;

export const GetMealsResponseSchema = z.object({
  count: z.number(),
  data: z.array(MealSchema),
});
export type GetMealsResponse = z.infer<typeof GetMealsResponseSchema>;
