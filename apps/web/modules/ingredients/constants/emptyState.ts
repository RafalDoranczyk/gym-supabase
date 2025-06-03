export const EMPTY_STATE_MESSAGES = {
  NO_MATCH_TITLE: "No matching ingredients",
  NO_FILTERS_TITLE: "No ingredients found",
  WELCOME_TITLE: "Start building your ingredients list",
  WELCOME_SUBTITLE: "Add your first ingredient to get started",
  SEARCH_NO_MATCH: (search: string) => `No ingredients match "${search}"`,
  FILTERED_NO_MATCH: "No ingredients found with current filters",
  CLEAR_FILTERS: "Clear Filters",
  ADD_INGREDIENT: "Add Ingredient",
} as const;
