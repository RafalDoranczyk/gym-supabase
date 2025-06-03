import { ControlledTextField } from "@/components";
import type { IngredientUnitType } from "@repo/schemas";
import type { Control, FieldErrors } from "react-hook-form";
import type { IngredientForm } from "../hooks/useIngredientForm";

const numberFields = [
  "calories",
  "carbs",
  "protein",
  "fat",
  "price",
] as const satisfies readonly (keyof IngredientForm)[];

type NumberField = (typeof numberFields)[number];

const FIELD_LABELS: Record<keyof Pick<IngredientForm, NumberField>, string> = {
  calories: "Calories",
  carbs: "Carbohydrates",
  protein: "Protein",
  fat: "Fat",
  price: "Price",
} as const;

type IngredientNumberFieldsProps = {
  control: Control<IngredientForm>;
  errors: FieldErrors<IngredientForm>;
  unitType: IngredientUnitType;
};

const getFieldLabel = (key: NumberField, unitType: IngredientUnitType) => {
  const baseLabel = FIELD_LABELS[key];
  return key === "price" ? baseLabel : `${baseLabel} / ${unitType}`;
};

export function IngredientNumberFields({ control, errors, unitType }: IngredientNumberFieldsProps) {
  return (
    <>
      {numberFields.map((key) => (
        <ControlledTextField
          control={control}
          helperText={errors[key]?.message}
          key={key}
          label={getFieldLabel(key, unitType)}
          name={key}
          type={key === "price" ? "number" : "text"}
          slotProps={{
            htmlInput: {
              inputMode: key === "price" ? "decimal" : "numeric",
            },
          }}
        />
      ))}
    </>
  );
}
