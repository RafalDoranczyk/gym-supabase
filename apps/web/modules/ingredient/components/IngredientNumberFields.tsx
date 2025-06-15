"use client";

import { ControlledTextField } from "@/components";
import { memo, useMemo } from "react";
import type { Control, FieldErrors } from "react-hook-form";
import type { IngredientFormData } from "../schemas";

const numberFields = [
  "calories",
  "carbs",
  "protein",
  "fat",
  "price",
] as const satisfies readonly (keyof IngredientFormData)[];

type NumberField = (typeof numberFields)[number];

const FIELD_LABELS: Record<keyof Pick<IngredientFormData, NumberField>, string> = {
  calories: "Calories",
  carbs: "Carbohydrates",
  protein: "Protein",
  fat: "Fat",
  price: "Price",
} as const;

type IngredientNumberFieldsProps = {
  control: Control<IngredientFormData>;
  errors: FieldErrors<IngredientFormData>;
};

// Memoized individual field component to prevent unnecessary re-renders
const NumberField = memo<{
  control: Control<IngredientFormData>;
  fieldKey: NumberField;
  label: string;
  error?: string;
}>(({ control, fieldKey, label, error }) => {
  return (
    <ControlledTextField
      control={control}
      helperText={error}
      key={fieldKey}
      label={label}
      name={fieldKey}
      type={fieldKey === "price" ? "number" : "text"}
      slotProps={{
        htmlInput: {
          inputMode: fieldKey === "price" ? "decimal" : "numeric",
        },
      }}
    />
  );
});

export const IngredientNumberFields = memo<IngredientNumberFieldsProps>(({ control, errors }) => {
  // Generate field configs with memoization
  const fieldConfigs = useMemo(
    () =>
      numberFields.map((fieldKey) => {
        const baseLabel = FIELD_LABELS[fieldKey];

        return {
          fieldKey,
          label: baseLabel,
          error: errors[fieldKey]?.message,
        };
      }),
    [errors]
  );

  return (
    <>
      {fieldConfigs.map(({ fieldKey, label, error }) => (
        <NumberField
          key={fieldKey}
          control={control}
          fieldKey={fieldKey}
          label={label}
          error={error}
        />
      ))}
    </>
  );
});
