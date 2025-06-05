import { z } from "zod";

import { CreatedAt, SupabaseId } from "../shared";
import { validationMessages } from "../shared/validationMessages";
import {
  INGREDIENT_GROUP_DESCRIPTION_MAX_LENGTH,
  INGREDIENT_GROUP_NAME_MAX_LENGTH,
  INGREDIENT_GROUP_NAME_MIN_LENGTH,
} from "./constants";

// ========================================
// Types & Schemas
// ========================================

export const IngredientGroupFormSchema = z.object({
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

export const IngredientGroupSchema = IngredientGroupFormSchema.extend({
  id: SupabaseId,
  user_id: SupabaseId,
  created_at: CreatedAt,
  updated_at: CreatedAt.nullable(),
});

// Extended schema with additional computed fields
export const IngredientGroupWithExamplesSchema = IngredientGroupSchema.extend({
  ingredientsCount: z.number(),
  examples: z.array(z.string()),
});

// ========================================
// API Schemas
// ========================================

export const FetchIngredientGroupsPayloadSchema = z.object({
  search: z.string().optional(),
  limit: z.coerce.number().min(1).max(100).optional(),
  offset: z.coerce.number().min(0).optional(),
  order: z.enum(["asc", "desc"]).optional(),
  orderBy: z.enum(["name", "created_at"]).optional(),
});

export const FetchIngredientGroupsResponseSchema = z.object({
  count: z.number(),
  data: z.array(IngredientGroupSchema),
});

export const FetchIngredientGroupsWithExamplesResponseSchema = z.object({
  count: z.number(),
  data: z.array(IngredientGroupWithExamplesSchema),
});

export const CreateIngredientGroupPayloadSchema = IngredientGroupFormSchema;

export const UpdateIngredientGroupPayloadSchema = IngredientGroupFormSchema.extend({
  id: SupabaseId,
});

export const DeleteIngredientGroupPayloadSchema = z.object({
  id: SupabaseId,
});

// ========================================
// Types
// ========================================

export type IngredientGroup = z.infer<typeof IngredientGroupSchema>;
export type IngredientGroupWithExamples = z.infer<typeof IngredientGroupWithExamplesSchema>;

// API Types
export type FetchIngredientGroupsPayload = z.infer<typeof FetchIngredientGroupsPayloadSchema>;
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
