export const MEASUREMENT_VALUE_MIN = 0;
export const MEASUREMENT_VALUE_MAX = 999999;
export const MEASUREMENT_NOTES_MAX_LENGTH = 500;

export const MEASUREMENT_UNIT_TYPES = {
  metric: "Metric",
  imperial: "Imperial",
} as const;

export const MEASUREMENT_TYPES = {
  BICEPS: "biceps",
  BODY_FAT_PERCENTAGE: "body_fat_percentage",
  CALF: "calf",
  CHEST: "chest",
  FOREARM: "forearm",
  HIPS: "hips",
  MUSCLE_MASS: "muscle_mass",
  THIGH: "thigh",
  WAIST: "waist",
  WATER_PERCENTAGE: "water_percentage",
  WEIGHT: "weight",
} as const;

// Categories
export const MEASUREMENT_CATEGORIES = {
  CIRCUMFERENCE: "circumference",
  BODY_COMPOSITION: "body_composition",
  WEIGHT: "weight",
} as const;
