import { fetchUserIngredientsForAI } from "./actions";
import type { GetExistingIngredientsParams, UserIngredientsForAIResponse } from "./types";

export const ingredientHandlers = {
  async getExistingIngredients(
    params: GetExistingIngredientsParams
  ): Promise<UserIngredientsForAIResponse> {
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
} as const;

export type IngredientHandlerNames = keyof typeof ingredientHandlers;
