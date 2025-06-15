import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CreateMealTagPayloadSchema, type MealTagFormData } from "../schemas";

export const mealTagDefaultValues: MealTagFormData = {
  name: "",
  description: "",
  color: "#8B5CF6",
};

export function useMealTagForm() {
  return useForm<MealTagFormData>({
    resolver: zodResolver(CreateMealTagPayloadSchema),
    defaultValues: mealTagDefaultValues,
  });
}
