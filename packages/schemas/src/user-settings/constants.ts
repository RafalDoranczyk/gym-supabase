import type { CreateUserPreferencesPayload } from "./schemas";

export const UNIT_SYSTEMS = {
  metric: "metric",
  imperial: "imperial",
} as const;

export const UNIT_SYSTEM_OPTIONS = [
  { id: "metric", name: "Metric (kg, cm, °C)" },
  { id: "imperial", name: "Imperial (lbs, ft, °F)" },
] as const;

export const userPreferencesDefaultValues: Omit<CreateUserPreferencesPayload, "user_id"> = {
  unit_system: "metric",
};
