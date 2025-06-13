import type { INGREDIENT_STARTER_GROUPS } from "@/modules/ingredient-group";
import type { Ingredient } from "@repo/schemas";

type StarterIngredients = Record<
  (typeof INGREDIENT_STARTER_GROUPS)[number]["name"],
  Pick<Ingredient, "name" | "calories" | "protein" | "carbs" | "fat">[]
>;

export const INGREDIENT_STARTER_ITEMS: StarterIngredients = {
  Proteins: [
    { name: "Chicken breast", calories: 165, protein: 31, carbs: 0, fat: 3.6 },
    { name: "Eggs", calories: 155, protein: 13, carbs: 1.1, fat: 11 },
    { name: "Greek yogurt", calories: 59, protein: 10, carbs: 3.6, fat: 0.4 },
  ],
  Carbohydrates: [
    { name: "Brown rice", calories: 111, protein: 2.6, carbs: 23, fat: 0.9 },
    { name: "Oats", calories: 68, protein: 2.4, carbs: 12, fat: 1.4 },
    { name: "Sweet potato", calories: 86, protein: 1.6, carbs: 20, fat: 0.1 },
  ],
  Fats: [
    { name: "Olive oil", calories: 884, protein: 0, carbs: 0, fat: 100 },
    { name: "Avocado", calories: 160, protein: 2, carbs: 8.5, fat: 14.7 },
    { name: "Almonds", calories: 579, protein: 21, carbs: 22, fat: 50 },
  ],
  Vegetables: [
    { name: "Spinach", calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4 },
    { name: "Broccoli", calories: 25, protein: 3, carbs: 5, fat: 0.4 },
    { name: "Bell pepper", calories: 31, protein: 1, carbs: 7, fat: 0.3 },
  ],
  Fruits: [
    { name: "Apple", calories: 52, protein: 0.3, carbs: 14, fat: 0.2 },
    { name: "Banana", calories: 89, protein: 1.1, carbs: 23, fat: 0.3 },
    { name: "Berries", calories: 32, protein: 0.7, carbs: 8, fat: 0.3 },
  ],
};
