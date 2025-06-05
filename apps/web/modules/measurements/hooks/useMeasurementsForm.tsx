"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateMeasurementPayloadSchema,
  type CreateMeasurementPayload,
  type UpdateMeasurementPayload,
} from "@repo/schemas";
import { useForm } from "react-hook-form";

export type MeasurementForm = CreateMeasurementPayload | UpdateMeasurementPayload;

export const measurementFormDefaultValues: MeasurementForm = {
  measurement_type_id: "",
  value: 0,
  unit: "metric" as const,
  notes: null,
  measured_at: new Date().toISOString(),
};

export function useMeasurementForm() {
  return useForm<MeasurementForm>({
    resolver: zodResolver(CreateMeasurementPayloadSchema),
    defaultValues: measurementFormDefaultValues,
  });
}
