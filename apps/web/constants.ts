export const APP_NAME = "Gym Supabase";
export const APP_DESCRIPTION =
  "Track nutrition, manage ingredients, and plan your meals with precision.";

export const PATHS = {
  DASHBOARD: "/dashboard",
  MEASUREMENTS: "/dashboard/measurements",
  NUTRITION: {
    ROOT: "/dashboard/nutrition",
    FOOD_DIARY: "/dashboard/nutrition/food-diary",
  },
  LIBRARY: {
    ROOT: "/dashboard/library",
    INGREDIENTS: "/dashboard/library/ingredients",
    MEALS: "/dashboard/library/meals",
  },
  SETTINGS: "/dashboard/settings",
  SETUP: "/dashboard/setup",
} as const;
