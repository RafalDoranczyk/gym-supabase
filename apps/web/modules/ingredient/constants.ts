// constants.ts
export const INGREDIENT_NAME_MIN_LENGTH = 3;
export const INGREDIENT_NAME_MAX_LENGTH = 24;
export const INGREDIENT_DESCRIPTION_MAX_LENGTH = 500;
export const INGREDIENT_PRICE_MAX = 999999;
export const INGREDIENT_NUTRITION_MIN = 0;
export const INGREDIENT_NUTRITION_MAX = 999;

export const INGREDIENT_UNIT_TYPES = {
  g: "100 g",
  kg: "1 kg",
  pcs: "1 piece",
} as const;

// Pagination constants
export const INGREDIENTS_DEFAULT_PAGE_SIZE = 50;
export const INGREDIENTS_MAX_PAGE_SIZE = 100;
export const INGREDIENTS_DEFAULT_OFFSET = 0;
export const INGREDIENTS_DEFAULT_ORDER = "asc" as const;
export const INGREDIENTS_DEFAULT_ORDER_BY = "name" as const;
