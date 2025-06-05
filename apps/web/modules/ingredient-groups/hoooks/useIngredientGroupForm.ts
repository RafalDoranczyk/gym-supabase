import { zodResolver } from "@hookform/resolvers/zod";
import {
  type CreateIngredientGroupPayload,
  CreateIngredientGroupPayloadSchema,
  type UpdateIngredientGroupPayload,
} from "@repo/schemas";
import { useForm } from "react-hook-form";

export type IngredientGroupForm = CreateIngredientGroupPayload | UpdateIngredientGroupPayload;

/**
 * Default values for creating a new ingredient
 * Used for form initialization and reset operations
 */
export const ingredientGroupDefaultValues: IngredientGroupForm = {
  id: "",
  name: "",
  description: "",
  color: "#ffffff",
};

export function useIngredientGroupForm() {
  return useForm<IngredientGroupForm>({
    resolver: zodResolver(CreateIngredientGroupPayloadSchema),
    defaultValues: ingredientGroupDefaultValues,
  });
}
