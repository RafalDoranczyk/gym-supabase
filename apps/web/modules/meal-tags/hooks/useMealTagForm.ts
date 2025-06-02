import { zodResolver } from "@hookform/resolvers/zod";
import { type CreateMealTagPayload, CreateMealTagPayloadSchema, type MealTag } from "@repo/schemas";
import { useMemo } from "react";
import { useForm } from "react-hook-form";

const getDefaultValues = (tag: MealTag | null): CreateMealTagPayload => ({
  name: tag?.name ?? "",
  description: tag?.description ?? "",
  color: tag?.color ?? "#8B5CF6",
});

export function useMealTagForm(tag: MealTag | null) {
  const defaultValues = useMemo(() => getDefaultValues(tag), [tag]);

  return useForm<CreateMealTagPayload>({
    resolver: zodResolver(CreateMealTagPayloadSchema),
    values: defaultValues,
  });
}
