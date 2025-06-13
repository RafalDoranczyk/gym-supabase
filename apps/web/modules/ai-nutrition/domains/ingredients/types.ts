// Base types for ingredients domain
export type UserIngredientForAI = {
  id: string;
  name: string;
  group_name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  unit_type: string;
};

export type UserIngredientsForAIResponse = {
  ingredients: UserIngredientForAI[];
  count: number;
  groups: string[];
};

// Function parameter types
export type GetExistingIngredientsParams = {
  groupName?: string;
};

export type SuggestIngredientsParams = {
  groupName: string;
  count?: number;
};

export type SuggestIngredientsResponse = {
  groupName: string;
  suggestions: Array<{
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    unit_type: string;
  }>;
  alreadyHave: string[];
  count: number;
};
