import { CreatedAt, SupabaseId, validationMessages } from "@/schemas/shared";
import { z } from "zod";
import {
  INGREDIENT_GROUP_DESCRIPTION_MAX_LENGTH,
  INGREDIENT_GROUP_NAME_MAX_LENGTH,
  INGREDIENT_GROUP_NAME_MIN_LENGTH,
} from "./constants";

// ========================================
// Types & Schemas
// ========================================

// Main ingredient group schema - single source of truth
export const IngredientGroupSchema = z.object({
  id: SupabaseId,
  user_id: SupabaseId,
  created_at: CreatedAt,
  updated_at: CreatedAt.nullable(),
  name: z
    .string()
    .min(INGREDIENT_GROUP_NAME_MIN_LENGTH, {
      message: validationMessages.string.min("Name", INGREDIENT_GROUP_NAME_MIN_LENGTH),
    })
    .max(INGREDIENT_GROUP_NAME_MAX_LENGTH, {
      message: validationMessages.string.max("Name", INGREDIENT_GROUP_NAME_MAX_LENGTH),
    }),
  description: z
    .string()
    .max(INGREDIENT_GROUP_DESCRIPTION_MAX_LENGTH, {
      message: validationMessages.string.max(
        "Description",
        INGREDIENT_GROUP_DESCRIPTION_MAX_LENGTH
      ),
    })
    .nullable()
    .optional(),
  color: z.string().min(1, {
    message: validationMessages.string.required("Color"),
  }),
});

// Extended schema with additional computed fields
export const IngredientGroupWithExamplesSchema = IngredientGroupSchema.extend({
  ingredientsCount: z.number(),
  examples: z.array(z.string()),
});

// ========================================
// API Schemas - derived from main schema
// ========================================

export const CreateIngredientGroupPayloadSchema = IngredientGroupSchema.omit({
  id: true,
  user_id: true,
  created_at: true,
  updated_at: true,
});

export const UpdateIngredientGroupPayloadSchema = IngredientGroupSchema.omit({
  user_id: true,
  created_at: true,
  updated_at: true,
});

export const DeleteIngredientGroupPayloadSchema = z.object({
  id: SupabaseId,
});

export const FetchIngredientGroupsResponseSchema = z.object({
  count: z.number(),
  data: z.array(IngredientGroupSchema),
});

export const FetchIngredientGroupsWithExamplesResponseSchema = z.object({
  count: z.number(),
  data: z.array(IngredientGroupWithExamplesSchema),
});

// ========================================
// Types
// ========================================

export type IngredientGroup = z.infer<typeof IngredientGroupSchema>;
export type IngredientGroupWithExamples = z.infer<typeof IngredientGroupWithExamplesSchema>;

// API Types
export type FetchIngredientGroupsResponse = z.infer<typeof FetchIngredientGroupsResponseSchema>;
export type FetchIngredientGroupsWithExamplesResponse = z.infer<
  typeof FetchIngredientGroupsWithExamplesResponseSchema
>;

// CRUD Types
export type CreateIngredientGroupPayload = z.infer<typeof CreateIngredientGroupPayloadSchema>;
export type UpdateIngredientGroupPayload = z.infer<typeof UpdateIngredientGroupPayloadSchema>;
export type DeleteIngredientGroupPayload = z.infer<typeof DeleteIngredientGroupPayloadSchema>;

// Response types
export type CreateIngredientGroupResponse = IngredientGroup;
export type UpdateIngredientGroupResponse = IngredientGroup;
export type DeleteIngredientGroupResponse = IngredientGroup;

// Form Types
export type IngredientGroupFormData = CreateIngredientGroupPayload & { id?: string };
