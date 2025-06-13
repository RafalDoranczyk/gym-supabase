import type { MealTag } from "@repo/schemas";

export const STARTER_MEAL_TAGS: Pick<MealTag, "name" | "color">[] = [
  // Meal times
  { name: "Breakfast", color: "#FF9800" },
  { name: "Brunch", color: "#FFC107" },
  { name: "Lunch", color: "#4CAF50" },
  { name: "Snack", color: "#03A9F4" },
  { name: "Dinner", color: "#673AB7" },
  { name: "Late night", color: "#795548" },

  // Diet types
  { name: "Vegan", color: "#4CAF50" },
  { name: "Vegetarian", color: "#8BC34A" },
  { name: "Keto", color: "#E91E63" },
  { name: "Low-carb", color: "#FF5722" },
  { name: "High-protein", color: "#3F51B5" },
  { name: "Paleo", color: "#795548" },
  { name: "Gluten-free", color: "#FF9800" },

  // Prep time
  { name: "Quick (5 min)", color: "#F44336" },
  { name: "Medium (15 min)", color: "#FF9800" },
  { name: "Slow (30+ min)", color: "#607D8B" },
];
