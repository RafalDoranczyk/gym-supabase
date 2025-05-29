import { zodResolver } from "@hookform/resolvers/zod";
import {
  type CreateMealPayload,
  CreateMealPayloadSchema,
  type Meal,
  type MealTag,
} from "@repo/schemas";
import { useMemo } from "react";
import { useForm } from "react-hook-form";

const getDefaultValues = (meal: Meal | null): CreateMealPayload => ({
  description: meal?.description ?? "",
  ingredients:
    meal?.meal_ingredients.map(({ amount, ingredient }) => ({
      amount,
      ingredient_id: ingredient.id,
    })) ?? [],
  name: meal?.name ?? "",
  tags: meal?.tags?.map((tag) => tag.id) ?? [],
});

export function useMealForm(meal: Meal | null, availableTags: MealTag[]) {
  const defaultValues = useMemo(() => getDefaultValues(meal), [meal]);

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
    setError,
    watch,
  } = useForm<CreateMealPayload>({
    defaultValues,
    resolver: zodResolver(CreateMealPayloadSchema),
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
