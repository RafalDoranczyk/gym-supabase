import { ControlledTextField } from "@/components";
import type { CreateIngredientPayload, IngredientUnitType } from "@repo/schemas";
import type { Control, FieldErrors } from "react-hook-form";

const numberFields: (keyof CreateIngredientPayload)[] = [
  "calories",
  "carbs",
  "protein",
  "fat",
  "price",
];

type IngredientNumberFieldsProps = {
  control: Control<CreateIngredientPayload>;
  errors: FieldErrors<CreateIngredientPayload>;
  unitType: IngredientUnitType;
};

export function IngredientNumberFields({ control, errors, unitType }: IngredientNumberFieldsProps) {
  return numberFields.map((key) => (
    <ControlledTextField
      control={control}
      helperText={errors[key]?.message}
      key={key}
      label={`${key.charAt(0).toUpperCase() + key.slice(1)} / ${unitType}`}
      name={key}
    />
  ));
}
