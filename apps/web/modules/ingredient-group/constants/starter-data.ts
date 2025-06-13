import type { CreateIngredientGroupPayload } from "@repo/schemas";

export const INGREDIENT_STARTER_GROUPS: CreateIngredientGroupPayload[] = [
  {
    name: "Proteins",
    color: "#FF6B6B",
    description: "Meat, fish, eggs, dairy, legumes and other protein sources",
  },
  {
    name: "Carbohydrates",
    color: "#4ECDC4",
    description: "Grains, bread, pasta, rice, potatoes and other carb sources",
  },
  {
    name: "Fats",
    color: "#45B7D1",
    description: "Oils, nuts, seeds, avocado and other healthy fats",
  },
  {
    name: "Vegetables",
    color: "#96CEB4",
    description: "Leafy greens, root vegetables, peppers and other veggies",
  },
  {
    name: "Fruits",
    color: "#FFEAA7",
    description: "Apples, bananas, berries and other fresh fruits",
  },
];
