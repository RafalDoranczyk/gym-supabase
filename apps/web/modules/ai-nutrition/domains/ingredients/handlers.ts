import { fetchUserIngredientsForAI } from "./actions";
import type { GetExistingIngredientsParams } from "./types";

// Export all handlers directly
export const ingredientHandlers = {
  async getExistingIngredients(params: GetExistingIngredientsParams) {
    const data = await fetchUserIngredientsForAI();

    if (params.groupName) {
      const name = params.groupName.toLowerCase();

      return {
        ...data,
        ingredients: data.ingredients.filter((ing) => ing.group_name.toLowerCase().includes(name)),
      };
    }

    return data;
  },
};
