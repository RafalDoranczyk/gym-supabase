import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  type CreateMealPayload,
  CreateMealPayloadSchema,
  type Meal,
  type MealTag,
} from "@repo/schemas";
import { useMemo } from "react";

const getDefaultValues = (meal: Meal | null): CreateMealPayload => ({
  description: meal?.description ?? "",
  ingredients:
    meal?.meal_ingredients?.map(({ amount, ingredient }) => ({
      amount,
      ingredient_id: ingredient.id,
    })) ?? [],
  name: meal?.name ?? "",
});

export function useMealForm(meal: Meal | null, availableTags: MealTag[]) {
  const defaultValues = useMemo(() => getDefaultValues(meal), [meal]);

  const methods = useForm<CreateMealPayload>({
    values: defaultValues,
    resolver: zodResolver(CreateMealPayloadSchema),
  });

  const fieldArray = useFieldArray({
    control: methods.control,
    name: "ingredients",
  });

  return {
    ...methods,
    fieldArray,
  };
}
