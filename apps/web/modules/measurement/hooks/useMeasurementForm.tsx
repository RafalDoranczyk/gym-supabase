"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CreateMeasurementPayloadSchema, type MeasurementFormData } from "../schemas";

export const measurementFormDefaultValues: MeasurementFormData = {
  measurement_type_id: "",
  value: 0,
  unit: "metric" as const,
  notes: null,
  measured_at: new Date().toISOString(),
};

export function useMeasurementForm() {
  return useForm<MeasurementFormData>({
    resolver: zodResolver(CreateMeasurementPayloadSchema),
    defaultValues: measurementFormDefaultValues,
  });
}
