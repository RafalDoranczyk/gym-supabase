"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { type CreateMeasurement, CreateMeasurementSchema } from "@repo/schemas";
import { useForm } from "react-hook-form";

export type CreateMeasurementForm = CreateMeasurement;

export function useMeasurementForm() {
  const form = useForm<CreateMeasurementForm>({
    resolver: zodResolver(CreateMeasurementSchema),
    defaultValues: {
      measurement_type_id: "",
      value: 0,
      unit: "metric" as const,
      notes: null,
      measured_at: new Date().toISOString(),
    },
  });

  const resetForm = () => {
    form.reset({
      measurement_type_id: "",
      value: 0,
      unit: "metric" as const,
      notes: null,
      measured_at: new Date().toISOString(),
    });
  };

  return {
    ...form,
    resetForm,
  };
}
