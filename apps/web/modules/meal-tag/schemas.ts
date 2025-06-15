import { CreatedAt, SupabaseId, validationMessages } from "@/schemas/shared";
import { z } from "zod";
import {
  MEAL_TAG_DESCRIPTION_MAX_LENGTH,
  MEAL_TAG_NAME_MAX_LENGTH,
  MEAL_TAG_NAME_MIN_LENGTH,
} from "./constants";

// ========================================
// Types & Schemas
// ========================================

// Main meal tag schema - single source of truth
export const MealTagSchema = z.object({
  id: SupabaseId,
  user_id: SupabaseId,
  created_at: CreatedAt,
  updated_at: CreatedAt,
  name: z
    .string()
    .min(MEAL_TAG_NAME_MIN_LENGTH, {
      message: validationMessages.string.min("Tag name", MEAL_TAG_NAME_MIN_LENGTH),
    })
    .max(MEAL_TAG_NAME_MAX_LENGTH, {
      message: validationMessages.string.max("Tag name", MEAL_TAG_NAME_MAX_LENGTH),
    })
    .transform((val) => val.trim()),
  description: z
    .string()
    .max(MEAL_TAG_DESCRIPTION_MAX_LENGTH, {
      message: validationMessages.string.max("Description", MEAL_TAG_DESCRIPTION_MAX_LENGTH),
    })
    .nullable()
    .optional(),
  color: z.string().min(1, {
    message: validationMessages.string.required("Color"),
  }),
});

// Helper schema for meal-to-tag relations
export const MealToTagSchema = z.object({
  tag: MealTagSchema.pick({
    id: true,
    name: true,
  }),
});

// Extended schema with additional computed fields
export const MealTagWithExamplesSchema = MealTagSchema.extend({
  mealsCount: z.number(),
  examples: z.array(z.string()),
});

// ========================================
// API Schemas - derived from main schema
// ========================================

export const CreateMealTagPayloadSchema = MealTagSchema.omit({
  id: true,
  user_id: true,
  created_at: true,
  updated_at: true,
});

export const UpdateMealTagPayloadSchema = MealTagSchema.omit({
  user_id: true,
  created_at: true,
  updated_at: true,
});

export const DeleteMealTagPayloadSchema = z.object({
  id: SupabaseId,
});

export const FetchMealTagsPayloadSchema = z.object({
  search: z.string().optional(),
  order: z.enum(["asc", "desc"]).optional(),
  orderBy: z.enum(["name", "created_at"]).optional(),
});

export const FetchMealTagsResponseSchema = z.object({
  count: z.number(),
  data: z.array(MealTagSchema),
});

export const FetchMealTagsWithExamplesResponseSchema = z.object({
  count: z.number(),
  data: z.array(MealTagWithExamplesSchema),
});

// ========================================
// Types
// ========================================

export type MealTag = z.infer<typeof MealTagSchema>;
export type MealTagWithExamples = z.infer<typeof MealTagWithExamplesSchema>;

// API Types
export type FetchMealTagsPayload = z.infer<typeof FetchMealTagsPayloadSchema>;
export type FetchMealTagsResponse = z.infer<typeof FetchMealTagsResponseSchema>;
export type FetchMealTagsWithExamplesResponse = z.infer<
  typeof FetchMealTagsWithExamplesResponseSchema
>;

// CRUD Types
export type CreateMealTagPayload = z.infer<typeof CreateMealTagPayloadSchema>;
export type UpdateMealTagPayload = z.infer<typeof UpdateMealTagPayloadSchema>;
export type DeleteMealTagPayload = z.infer<typeof DeleteMealTagPayloadSchema>;

// Response types
export type CreateMealTagResponse = MealTag;
export type UpdateMealTagResponse = MealTag;
export type DeleteMealTagResponse = MealTag;

// Form Types
export type MealTagFormData = CreateMealTagPayload & { id?: string };
