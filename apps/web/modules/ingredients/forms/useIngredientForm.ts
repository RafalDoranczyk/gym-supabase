import { zodResolver } from "@hookform/resolvers/zod";
import {
  type CreateIngredientPayload,
  CreateIngredientPayloadSchema,
  type Ingredient,
  type NutritionGroup,
} from "@repo/schemas";
import { useMemo } from "react";
import { useForm } from "react-hook-form";

const getDefaultValues = (
  ingredient: Ingredient | null,
  groups: NutritionGroup[],
): CreateIngredientPayload => ({
  calories: ingredient?.calories ?? 0,
  carbs: ingredient?.carbs ?? 0,
  fat: ingredient?.fat ?? 0,
  group_id: ingredient?.group_id ?? groups[0].id,
  name: ingredient?.name ?? "",
  price: ingredient?.price ?? 0,
  protein: ingredient?.protein ?? 0,
  unit_type: ingredient?.unit_type ?? "g",
});

export function useIngredientForm(ingredient: Ingredient | null, groups: NutritionGroup[]) {
  const defaultValues = useMemo(() => getDefaultValues(ingredient, groups), [ingredient, groups]);

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
    setError,
    watch,
  } = useForm<CreateIngredientPayload>({
    resolver: zodResolver(CreateIngredientPayloadSchema),
    values: defaultValues,
  });

  return {
    control,
    errors,
    handleSubmit,
    reset,
    setError,
    watch,
  };
}
