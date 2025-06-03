import { z } from "zod";

import { CreatedAt, SupabaseId, validationMessages } from "../shared";

// ---------- MEASUREMENTS ----------
export const MeasurementSchema = z.object({
  id: SupabaseId,
  measurement_type_id: z.string(),
  value: z.number().min(0, validationMessages.number.min("Value", 0)),
  unit: z.enum(["metric", "imperial"]),
  notes: z.string().nullable(),
  measured_at: CreatedAt,
  user_id: SupabaseId,
  created_at: CreatedAt,
});

export type Measurement = z.infer<typeof MeasurementSchema>;

// ---------- MEASUREMENTS CRUD ----------

// CREATE
export const CreateMeasurementSchema = MeasurementSchema.omit({
  id: true,
  created_at: true,
  user_id: true,
});

export type CreateMeasurement = z.infer<typeof CreateMeasurementSchema>;

// UPDATE
export const UpdateMeasurementSchema = MeasurementSchema.omit({
  id: true,
  created_at: true,
  user_id: true,
}).partial();

export type UpdateMeasurement = z.infer<typeof UpdateMeasurementSchema>;

// UPDATE WITH ID (for API endpoints that need the ID)
export const UpdateMeasurementWithIdSchema = z.object({
  id: SupabaseId,
  data: UpdateMeasurementSchema,
});

export type UpdateMeasurementWithId = z.infer<typeof UpdateMeasurementWithIdSchema>;

// DELETE
export const DeleteMeasurementSchema = z.object({
  id: SupabaseId,
});

export type DeleteMeasurement = z.infer<typeof DeleteMeasurementSchema>;

// GET RESPONSES
export const GetMeasurementsResponseSchema = z.object({
  count: z.number(),
  data: MeasurementSchema.array(),
});

export type GetMeasurementsResponse = z.infer<typeof GetMeasurementsResponseSchema>;

export const GetMeasurementByIdResponseSchema = MeasurementSchema;

export type GetMeasurementByIdResponse = z.infer<typeof GetMeasurementByIdResponseSchema>;

// BULK OPERATIONS
export const CreateMeasurementsSchema = z.object({
  measurements: CreateMeasurementSchema.array().min(1, "At least one measurement is required"),
});

export type CreateMeasurements = z.infer<typeof CreateMeasurementsSchema>;

export const DeleteMeasurementsSchema = z.object({
  ids: SupabaseId.array().min(1, "At least one ID is required"),
});

export type DeleteMeasurements = z.infer<typeof DeleteMeasurementsSchema>;
