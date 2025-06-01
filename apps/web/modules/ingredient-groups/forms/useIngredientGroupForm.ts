import { zodResolver } from "@hookform/resolvers/zod";
import {
  type CreateNutritionGroupPayload,
  CreateNutritionGroupPayloadSchema,
  type NutritionGroup,
} from "@repo/schemas";
import { useMemo } from "react";
import { useForm } from "react-hook-form";

const getDefaultValues = (group: NutritionGroup | null): CreateNutritionGroupPayload => ({
  name: group?.name ?? "",
  description: group?.description ?? "",
  color: group?.color ?? "#ffffff",
});

export function useIngredientGroupForm(group: NutritionGroup | null) {
  const defaultValues = useMemo(() => getDefaultValues(group), [group]);

  return useForm<CreateNutritionGroupPayload>({
    resolver: zodResolver(CreateNutritionGroupPayloadSchema),
    values: defaultValues,
  });
}
