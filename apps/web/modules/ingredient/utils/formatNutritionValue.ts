/**
 * Formats numeric values for table display
 */
export const formatNutritionValue = (value?: number | null): string => {
  if (value === null || value === undefined || value === 0) {
    return "—";
  }
  return value.toString();
};
