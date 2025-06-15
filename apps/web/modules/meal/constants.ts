// Meal validation constants
export const MEAL_NAME_MIN_LENGTH = 2;
export const MEAL_NAME_MAX_LENGTH = 100;
export const MEAL_DESCRIPTION_MAX_LENGTH = 500;

// Pagination constants
export const MEALS_DEFAULT_PAGE_SIZE = 50;
export const MEALS_MAX_PAGE_SIZE = 100;
export const MEALS_DEFAULT_OFFSET = 0;
export const MEALS_DEFAULT_ORDER = "asc" as const;
export const MEALS_DEFAULT_ORDER_BY = "name" as const;
