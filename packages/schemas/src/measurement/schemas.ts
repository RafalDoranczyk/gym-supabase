import { z } from "zod";

import { MeasurementTypeSchema } from "../measurement-types"; // Import existing schema
import { CreatedAt, SupabaseId } from "../shared";
import { validationMessages } from "../shared/validationMessages";
import {
  MEASUREMENT_NOTES_MAX_LENGTH,
  MEASUREMENT_TYPES,
  MEASUREMENT_UNIT_TYPES,
  MEASUREMENT_VALUE_MAX,
  MEASUREMENT_VALUE_MIN,
} from "./constants";

// ========================================
// Measurement Type Constants & Types
// ========================================

// Strict types for known measurement types + fallback for new ones
export type MeasurementTypeId = (typeof MEASUREMENT_TYPES)[keyof typeof MEASUREMENT_TYPES] | string; // fallback for new types added to database

// Schema uses string for flexibility, but we keep the constants for type safety in code
export const MeasurementTypeIdSchema = z.string().min(1, {
  message: validationMessages.string.required("Measurement type"),
});

// ========================================
// Types & Schemas
// ========================================

export type MeasurementUnitType = keyof typeof MEASUREMENT_UNIT_TYPES;

export const MeasurementUnitTypeSchema = z.enum(
  Object.keys(MEASUREMENT_UNIT_TYPES) as [MeasurementUnitType, ...MeasurementUnitType[]],
  {
    message: validationMessages.enum("Unit type", MEASUREMENT_UNIT_TYPES),
  }
);

// Measurement Type schema (for the nested object from backend)
// Using existing MeasurementTypeSchema from measurement-types module

export const MeasurementFormSchema = z.object({
  measurement_type_id: MeasurementTypeIdSchema,
  value: z.coerce
    .number()
    .min(MEASUREMENT_VALUE_MIN, {
      message: validationMessages.number.min("Value", MEASUREMENT_VALUE_MIN),
    })
    .max(MEASUREMENT_VALUE_MAX, {
      message: validationMessages.number.max("Value", MEASUREMENT_VALUE_MAX),
    }),
  unit: MeasurementUnitTypeSchema,
  notes: z
    .string()
    .max(MEASUREMENT_NOTES_MAX_LENGTH, {
      message: validationMessages.string.max("Notes", MEASUREMENT_NOTES_MAX_LENGTH),
    })
    .nullable()
    .optional(),
  measured_at: CreatedAt,
});

// Backend response includes the nested measurement_type object
export const MeasurementSchema = MeasurementFormSchema.extend({
  id: SupabaseId,
  user_id: SupabaseId,
  created_at: CreatedAt,
  measurement_type: MeasurementTypeSchema,
});

// For cases where you only need the basic measurement without nested data
export const BasicMeasurementSchema = MeasurementFormSchema.extend({
  id: SupabaseId,
  user_id: SupabaseId,
  created_at: CreatedAt,
});

// ========================================
// API Schemas
// ========================================

export const FetchMeasurementsPayloadSchema = z.object({
  measurement_type_id: MeasurementTypeIdSchema.optional(),
  unit: MeasurementUnitTypeSchema.optional(),
  date_from: z.string().optional(),
  date_to: z.string().optional(),
  limit: z.coerce.number().min(1).max(100).optional(),
  offset: z.coerce.number().min(0).optional(),
  order: z.enum(["asc", "desc"]).optional(),
  orderBy: z.enum(["measured_at", "value", "created_at"]).optional(),
});

export const FetchMeasurementsResponseSchema = z.object({
  count: z.number(),
  data: z.array(MeasurementSchema), // Uses full schema with nested data
});

export const CreateMeasurementPayloadSchema = MeasurementFormSchema;

export const CreateMeasurementsPayloadSchema = z.object({
  measurements: z.array(CreateMeasurementPayloadSchema).min(1, {
    message: validationMessages.array.min("Measurements", 1),
  }),
});

export const UpdateMeasurementPayloadSchema = MeasurementFormSchema.extend({
  id: SupabaseId,
});

export const DeleteMeasurementPayloadSchema = z.object({
  id: SupabaseId,
});

export const DeleteMeasurementsPayloadSchema = z.object({
  ids: z.array(SupabaseId).min(1, {
    message: validationMessages.array.min("IDs", 1),
  }),
});

// ========================================
// Type Guards & Utilities
// ========================================

// Type guards for known measurement types (with full type safety)
export const isWeightMeasurement = (id: string): id is typeof MEASUREMENT_TYPES.WEIGHT =>
  id === MEASUREMENT_TYPES.WEIGHT;

// Create arrays with proper typing
const CIRCUMFERENCE_TYPES = [
  MEASUREMENT_TYPES.BICEPS,
  MEASUREMENT_TYPES.CALF,
  MEASUREMENT_TYPES.CHEST,
  MEASUREMENT_TYPES.FOREARM,
  MEASUREMENT_TYPES.HIPS,
  MEASUREMENT_TYPES.THIGH,
  MEASUREMENT_TYPES.WAIST,
] as const;

const BODY_COMPOSITION_TYPES = [
  MEASUREMENT_TYPES.BODY_FAT_PERCENTAGE,
  MEASUREMENT_TYPES.MUSCLE_MASS,
  MEASUREMENT_TYPES.WATER_PERCENTAGE,
] as const;

export const isCircumferenceMeasurement = (id: string): boolean =>
  CIRCUMFERENCE_TYPES.includes(id as (typeof CIRCUMFERENCE_TYPES)[number]);

export const isBodyCompositionMeasurement = (id: string): boolean =>
  BODY_COMPOSITION_TYPES.includes(id as (typeof BODY_COMPOSITION_TYPES)[number]);

// ========================================
// Types
// ========================================

// MeasurementType is imported from measurement-types module
export type Measurement = z.infer<typeof MeasurementSchema>;
export type BasicMeasurement = z.infer<typeof BasicMeasurementSchema>;

// API Types
export type FetchMeasurementsPayload = z.infer<typeof FetchMeasurementsPayloadSchema>;
export type FetchMeasurementsResponse = z.infer<typeof FetchMeasurementsResponseSchema>;

// CRUD Types
export type CreateMeasurementPayload = z.infer<typeof CreateMeasurementPayloadSchema>;
export type CreateMeasurementsPayload = z.infer<typeof CreateMeasurementsPayloadSchema>;
export type UpdateMeasurementPayload = z.infer<typeof UpdateMeasurementPayloadSchema>;
export type DeleteMeasurementPayload = z.infer<typeof DeleteMeasurementPayloadSchema>;
export type DeleteMeasurementsPayload = z.infer<typeof DeleteMeasurementsPayloadSchema>;

// Response types (return full Measurement with nested data)
export type CreateMeasurementResponse = BasicMeasurement;
export type CreateMeasurementsResponse = BasicMeasurement[];
export type UpdateMeasurementResponse = BasicMeasurement;
export type DeleteMeasurementResponse = BasicMeasurement;
export type DeleteMeasurementsResponse = BasicMeasurement[];
