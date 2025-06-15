import {
  Balance,
  Category,
  FitnessCenter,
  FlashOn,
  Kitchen,
  LocalOffer,
  TrendingDown,
  TrendingUp,
} from "@mui/icons-material";
import type { Ingredient } from "../ingredient";
import type { CreateIngredientGroupPayload } from "../ingredient-group";
import type { MealTag } from "../meal-tag";

// ========================================
// ONBOARDING STEPS
// ========================================

export const ONBOARDING_STEPS = [
  {
    id: "ingredient-groups" as const,
    label: "Ingredient Groups",
    description: "Organize ingredients into categories",
    icon: <Category />,
  },
  {
    id: "meal-tags" as const,
    label: "Meal Tags",
    description: "Select tags to categorize meals",
    icon: <LocalOffer />,
  },
  {
    id: "nutrition-goals" as const,
    label: "Nutrition Goals",
    description: "Set your nutrition targets",
    icon: <FitnessCenter />,
  },
  {
    id: "setup-complete" as const,
    label: "Setup Complete",
    description: "Finalize your nutrition database",
    icon: <Kitchen />,
  },
] as const;

// Export types for type safety
export type OnboardingStepId = (typeof ONBOARDING_STEPS)[number]["id"];
export type OnboardingStep = (typeof ONBOARDING_STEPS)[number];

// ========================================
// INGREDIENT GROUPS & DATA
// ========================================

type StarterIngredients = Record<
  (typeof INGREDIENT_STARTER_GROUPS)[number]["name"],
  Pick<Ingredient, "name" | "calories" | "protein" | "carbs" | "fat">[]
>;

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
  {
    name: "Dairy & Alternatives",
    color: "#DDA0DD",
    description: "Milk, cheese, yogurt, plant-based alternatives and dairy products",
  },
] as const;

export const POPULAR_INGREDIENT_GROUPS = ["Proteins", "Carbohydrates"];

// ========================================
// MEAL TAGS
// ========================================

export const MEAL_STARTER_TAGS: Pick<MealTag, "name" | "color">[] = [
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

// ========================================
// STARTER INGREDIENTS DATA
// ========================================

export const STARTER_INGREDIENTS: StarterIngredients = {
  Proteins: [
    { name: "Chicken Breast", calories: 165, protein: 23, carbs: 0, fat: 3.6 },
    { name: "Salmon Fillet", calories: 208, protein: 20, carbs: 0, fat: 12 },
    { name: "Ground Beef (Lean)", calories: 250, protein: 26, carbs: 0, fat: 15 },
    { name: "Eggs", calories: 155, protein: 13, carbs: 1.1, fat: 11 },
    { name: "Greek Yogurt (0% fat)", calories: 59, protein: 10, carbs: 3.6, fat: 0.4 },
    { name: "Tuna (Canned in Water)", calories: 116, protein: 25, carbs: 0, fat: 1 },
    { name: "Turkey Breast", calories: 135, protein: 24, carbs: 0, fat: 3 },
    { name: "Tofu (Firm)", calories: 76, protein: 8, carbs: 1.9, fat: 4.8 },
    { name: "Black Beans (Cooked)", calories: 132, protein: 8.9, carbs: 23, fat: 0.5 },
    { name: "Lentils (Cooked)", calories: 116, protein: 9, carbs: 20, fat: 0.4 },
    { name: "Cottage Cheese (Low-fat)", calories: 98, protein: 11, carbs: 3.4, fat: 4.3 },
    { name: "Whey Protein Powder", calories: 354, protein: 80, carbs: 4, fat: 1.5 },
    { name: "Shrimp", calories: 99, protein: 18, carbs: 0.2, fat: 1.4 },
    { name: "Pork Tenderloin", calories: 143, protein: 26, carbs: 0, fat: 3.5 },
    { name: "Cod Fish", calories: 82, protein: 18, carbs: 0, fat: 0.7 },
  ],

  Carbohydrates: [
    { name: "Brown Rice (Cooked)", calories: 112, protein: 2.6, carbs: 23, fat: 0.9 },
    { name: "Quinoa (Cooked)", calories: 120, protein: 4.4, carbs: 22, fat: 1.9 },
    { name: "Oats (Cooked)", calories: 68, protein: 2.4, carbs: 12, fat: 1.4 },
    { name: "Sweet Potato (Baked)", calories: 86, protein: 1.6, carbs: 20, fat: 0.1 },
    { name: "Whole Wheat Bread", calories: 247, protein: 13, carbs: 41, fat: 4.2 },
    { name: "Pasta (Whole Wheat, Cooked)", calories: 124, protein: 5, carbs: 25, fat: 1.1 },
    { name: "White Rice (Cooked)", calories: 130, protein: 2.7, carbs: 28, fat: 0.3 },
    { name: "Potato (Baked)", calories: 93, protein: 2.1, carbs: 21, fat: 0.1 },
    { name: "Barley (Cooked)", calories: 123, protein: 2.3, carbs: 28, fat: 0.4 },
    { name: "Buckwheat (Cooked)", calories: 92, protein: 3.4, carbs: 19, fat: 0.6 },
    { name: "Couscous (Cooked)", calories: 112, protein: 3.8, carbs: 23, fat: 0.2 },
    { name: "Corn (Kernels)", calories: 86, protein: 3.3, carbs: 19, fat: 1.4 },
    { name: "White Bread", calories: 265, protein: 9, carbs: 49, fat: 3.2 },
    { name: "Banana", calories: 89, protein: 1.1, carbs: 23, fat: 0.3 },
    { name: "Bagel (Plain)", calories: 245, protein: 10, carbs: 48, fat: 1.5 },
  ],

  Fats: [
    { name: "Olive Oil", calories: 884, protein: 0, carbs: 0, fat: 100 },
    { name: "Avocado", calories: 160, protein: 2, carbs: 9, fat: 15 },
    { name: "Almonds", calories: 579, protein: 21, carbs: 22, fat: 50 },
    { name: "Walnuts", calories: 654, protein: 15, carbs: 14, fat: 65 },
    { name: "Coconut Oil", calories: 862, protein: 0, carbs: 0, fat: 100 },
    { name: "Peanut Butter", calories: 588, protein: 25, carbs: 20, fat: 50 },
    { name: "Cashews", calories: 553, protein: 18, carbs: 30, fat: 44 },
    { name: "Sunflower Seeds", calories: 584, protein: 21, carbs: 20, fat: 51 },
    { name: "Flaxseeds", calories: 534, protein: 18, carbs: 29, fat: 42 },
    { name: "Chia Seeds", calories: 486, protein: 17, carbs: 42, fat: 31 },
    { name: "Sesame Oil", calories: 884, protein: 0, carbs: 0, fat: 100 },
    { name: "Butter", calories: 717, protein: 0.9, carbs: 0.1, fat: 81 },
    { name: "Pecans", calories: 691, protein: 9, carbs: 14, fat: 72 },
    { name: "Macadamia Nuts", calories: 718, protein: 8, carbs: 14, fat: 76 },
    { name: "Tahini", calories: 595, protein: 17, carbs: 21, fat: 54 },
  ],

  Vegetables: [
    { name: "Spinach", calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4 },
    { name: "Broccoli", calories: 34, protein: 2.8, carbs: 7, fat: 0.4 },
    { name: "Bell Pepper (Red)", calories: 31, protein: 1, carbs: 7, fat: 0.3 },
    { name: "Carrots", calories: 41, protein: 0.9, carbs: 10, fat: 0.2 },
    { name: "Tomatoes", calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2 },
    { name: "Cucumber", calories: 16, protein: 0.7, carbs: 4, fat: 0.1 },
    { name: "Lettuce (Romaine)", calories: 17, protein: 1.2, carbs: 3.3, fat: 0.3 },
    { name: "Kale", calories: 35, protein: 2.9, carbs: 7, fat: 0.9 },
    { name: "Cauliflower", calories: 25, protein: 1.9, carbs: 5, fat: 0.3 },
    { name: "Zucchini", calories: 17, protein: 1.2, carbs: 3.1, fat: 0.3 },
    { name: "Mushrooms (White)", calories: 22, protein: 3.1, carbs: 3.3, fat: 0.3 },
    { name: "Onion", calories: 40, protein: 1.1, carbs: 9.3, fat: 0.1 },
    { name: "Green Beans", calories: 31, protein: 1.8, carbs: 7, fat: 0.2 },
    { name: "Asparagus", calories: 20, protein: 2.2, carbs: 3.9, fat: 0.1 },
    { name: "Brussels Sprouts", calories: 43, protein: 3.4, carbs: 9, fat: 0.3 },
  ],

  Fruits: [
    { name: "Apple", calories: 52, protein: 0.3, carbs: 14, fat: 0.2 },
    { name: "Orange", calories: 47, protein: 0.9, carbs: 12, fat: 0.1 },
    { name: "Strawberries", calories: 32, protein: 0.7, carbs: 8, fat: 0.3 },
    { name: "Blueberries", calories: 57, protein: 0.7, carbs: 14, fat: 0.3 },
    { name: "Grapes", calories: 62, protein: 0.6, carbs: 16, fat: 0.2 },
    { name: "Pineapple", calories: 50, protein: 0.5, carbs: 13, fat: 0.1 },
    { name: "Mango", calories: 60, protein: 0.8, carbs: 15, fat: 0.4 },
    { name: "Kiwi", calories: 61, protein: 1.1, carbs: 15, fat: 0.5 },
    { name: "Watermelon", calories: 30, protein: 0.6, carbs: 8, fat: 0.2 },
    { name: "Peach", calories: 39, protein: 0.9, carbs: 10, fat: 0.3 },
    { name: "Pear", calories: 57, protein: 0.4, carbs: 15, fat: 0.1 },
    { name: "Cherries", calories: 63, protein: 1.1, carbs: 16, fat: 0.2 },
    { name: "Raspberries", calories: 52, protein: 1.2, carbs: 12, fat: 0.7 },
    { name: "Blackberries", calories: 43, protein: 1.4, carbs: 10, fat: 0.5 },
    { name: "Papaya", calories: 43, protein: 0.5, carbs: 11, fat: 0.3 },
  ],

  "Dairy & Alternatives": [
    { name: "Milk (Whole)", calories: 61, protein: 3.2, carbs: 4.8, fat: 3.3 },
    { name: "Milk (Skim)", calories: 34, protein: 3.4, carbs: 5, fat: 0.1 },
    { name: "Cheddar Cheese", calories: 402, protein: 25, carbs: 1.3, fat: 33 },
    { name: "Mozzarella Cheese", calories: 280, protein: 22, carbs: 2.2, fat: 22 },
    { name: "Plain Yogurt (Whole)", calories: 61, protein: 3.5, carbs: 4.7, fat: 3.3 },
    { name: "Almond Milk (Unsweetened)", calories: 15, protein: 0.6, carbs: 0.6, fat: 1.2 },
    { name: "Soy Milk (Unsweetened)", calories: 33, protein: 2.9, carbs: 1.8, fat: 1.8 },
    { name: "Oat Milk", calories: 47, protein: 1.0, carbs: 7.0, fat: 1.5 },
    { name: "Cream Cheese", calories: 342, protein: 6, carbs: 4, fat: 34 },
    { name: "Ricotta Cheese", calories: 174, protein: 11, carbs: 3, fat: 13 },
    { name: "Parmesan Cheese", calories: 431, protein: 38, carbs: 4, fat: 29 },
    { name: "Coconut Milk (Canned)", calories: 230, protein: 2.3, carbs: 6, fat: 24 },
    { name: "Cashew Milk", calories: 25, protein: 1, carbs: 2, fat: 2 },
    { name: "Goat Cheese", calories: 364, protein: 22, carbs: 2.5, fat: 30 },
    { name: "Heavy Cream", calories: 345, protein: 2.1, carbs: 2.8, fat: 37 },
  ],
};

// ========================================
// FITNNESS DATA
// ========================================

export const FITNESS_PHASES_UI = [
  {
    id: "cutting" as const,
    name: "Cutting",
    description: "Burn fat while maintaining muscle mass",
    icon: <TrendingDown />,
    color: "error",
    benefits: ["Weight loss", "Muscle definition", "Better proportions"],
  },
  {
    id: "bulking" as const,
    name: "Bulking",
    description: "Build muscle with controlled weight gain",
    icon: <TrendingUp />,
    color: "success",
    benefits: ["Muscle growth", "Increased strength", "Better performance"],
  },
  {
    id: "maintenance" as const,
    name: "Maintenance",
    description: "Maintain current weight and body composition",
    icon: <Balance />,
    color: "primary",
    benefits: ["Stable weight", "Maintain fitness", "Balanced diet"],
  },
  {
    id: "recomp" as const,
    name: "Recomposition",
    description: "Simultaneously burn fat and build muscle",
    icon: <FlashOn />,
    color: "warning",
    benefits: ["Body composition", "Stable weight", "Long-term results"],
  },
];

export const ACTIVITY_LEVELS_UI = [
  {
    id: "sedentary" as const,
    name: "Sedentary",
    description: "Office work, minimal exercise",
    multiplier: "1.2x",
  },
  {
    id: "lightly_active" as const,
    name: "Lightly Active",
    description: "Light exercise 1-3 days/week",
    multiplier: "1.375x",
  },
  {
    id: "moderately_active" as const,
    name: "Moderately Active",
    description: "Moderate exercise 3-5 days/week",
    multiplier: "1.55x",
  },
  {
    id: "very_active" as const,
    name: "Very Active",
    description: "Hard exercise 6-7 days/week",
    multiplier: "1.725x",
  },
  {
    id: "extra_active" as const,
    name: "Extra Active",
    description: "Very hard exercise, physical job",
    multiplier: "1.9x",
  },
];

// ========================================
// HELPER FUNCTIONS
// ========================================

export function getStarterIngredientsByGroup(groupName: keyof StarterIngredients) {
  return STARTER_INGREDIENTS[groupName] || [];
}

// Onboarding step helpers
export const getStepById = (id: OnboardingStepId) =>
  ONBOARDING_STEPS.find((step) => step.id === id);

export const getStepIndex = (id: OnboardingStepId) =>
  ONBOARDING_STEPS.findIndex((step) => step.id === id);

export const TOTAL_ONBOARDING_STEPS = ONBOARDING_STEPS.length;
