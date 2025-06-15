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

export type GetExistingIngredientsParams = {
  groupName?: string;
};
