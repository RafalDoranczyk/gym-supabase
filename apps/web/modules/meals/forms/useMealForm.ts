"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { type CreateMealPayload, CreateMealPayloadSchema, type Meal } from "@repo/schemas";
import { useMemo } from "react";
import { useFieldArray, useForm } from "react-hook-form";

const getDefaultValues = (meal: Meal | null): CreateMealPayload => ({
  name: meal?.name ?? "",
  description: meal?.description ?? "",
  ingredients:
    meal?.meal_ingredients?.map(({ amount, ingredient }) => ({
      amount,
      ingredient_id: ingredient.id,
    })) ?? [],
  tag_ids: meal?.meal_to_tags?.map((tag) => tag.tag.id) ?? [],
});

export function useMealForm(meal: Meal | null) {
  const defaultValues = useMemo(() => getDefaultValues(meal), [meal]);

  const methods = useForm<CreateMealPayload>({
    defaultValues,
    resolver: zodResolver(CreateMealPayloadSchema),
    mode: "onChange",
  });

  const fieldArray = useFieldArray({
    control: methods.control,
    name: "ingredients",
  });

  const selectedTagIds = methods.watch("tag_ids");

  const handleTagChange = (tagIds: string[]) => {
    methods.setValue("tag_ids", tagIds, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  return {
    ...methods,
    fieldArray,
    selectedTagIds,
    handleTagChange,
  };
}
