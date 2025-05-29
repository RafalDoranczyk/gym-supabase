export const INGREDIENT_UNIT_TYPES = {
  g: '100 g',
  kg: '1 kg',
  pcs: '1 piece',
} as const;

export type IngredientUnitType = keyof typeof INGREDIENT_UNIT_TYPES;
