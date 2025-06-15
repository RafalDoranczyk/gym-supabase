import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CreateIngredientGroupPayloadSchema, type IngredientGroupFormData } from "../schemas";

export const ingredientGroupDefaultValues: IngredientGroupFormData = {
  id: "",
  name: "",
  description: "",
  color: "#ffffff",
};

export function useIngredientGroupForm() {
  return useForm<IngredientGroupFormData>({
    resolver: zodResolver(CreateIngredientGroupPayloadSchema),
    defaultValues: ingredientGroupDefaultValues,
  });
}
