export const INGREDIENT_MESSAGES = {
  DELETE_SUCCESS: (name: string) => `Ingredient ${name} removed successfully`,
  DELETE_ERROR: (error: string) => `Failed to remove ingredient: ${error}`,
  CONFIRM_DELETE: (name?: string) =>
    `Are you sure you want to remove ${name ?? "this ingredient"}?`,
} as const;
