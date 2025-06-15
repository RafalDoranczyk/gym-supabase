import type { CreateUserSettingsPayload } from "./schemas";

export const UNIT_SYSTEMS = {
  metric: "metric",
  imperial: "imperial",
} as const;

export const UNIT_SYSTEM_OPTIONS = [
  { id: "metric", name: "Metric (kg, cm, °C)" },
  { id: "imperial", name: "Imperial (lbs, ft, °F)" },
] as const;

export const userPreferencesDefaultValues: Omit<CreateUserSettingsPayload, "user_id"> = {
  unit_system: "metric",
  onboarding_completed: false,
  onboarding_completed_at: "",
};
