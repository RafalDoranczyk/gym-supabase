import { CreatedAt } from "@/schemas/shared";
import { z } from "zod";
import { UNIT_SYSTEMS } from "./constants";

// ========================================
// Helper Schemas
// ========================================

export type UnitSystem = keyof typeof UNIT_SYSTEMS;

// ========================================
// Types & Schemas
// ========================================

// Main user preferences schema - single source of truth
export const UserSettingsSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  created_at: CreatedAt,
  updated_at: CreatedAt,
  unit_system: z.nativeEnum(UNIT_SYSTEMS),
  onboarding_completed: z.boolean(),
  onboarding_completed_at: CreatedAt,
});

// ========================================
// API Schemas - derived from main schema
// ========================================

export const CreateUserSettingsPayloadSchema = UserSettingsSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const UpdateUserSettingsPayloadSchema = UserSettingsSchema.omit({
  id: true,
  user_id: true,
  created_at: true,
  updated_at: true,
}).partial();

export const FetchUserSettingsResponseSchema = UserSettingsSchema;

// ========================================
// Types
// ========================================

export type UserSettings = z.infer<typeof UserSettingsSchema>;

// API Types
export type CreateUserSettingsPayload = z.infer<typeof CreateUserSettingsPayloadSchema>;
export type UpdateUserSettingsPayload = z.infer<typeof UpdateUserSettingsPayloadSchema>;
export type FetchUserSettingsResponse = z.infer<typeof FetchUserSettingsResponseSchema>;

// Form Types
export type UserSettingsFormData = CreateUserSettingsPayload & { id?: string };
