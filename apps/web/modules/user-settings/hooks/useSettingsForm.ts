import { useToast } from "@/providers";
import type { UnitSystem, UserPreferences } from "@repo/schemas";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { updateUserPreferences } from "../actions/updateUserPreferences";

// Form schema for all settings
export type SettingsForm = {
  unit_system: UnitSystem;
};

// Default values for the form
export const settingsFormDefaultValues: SettingsForm = {
  unit_system: "metric",
};

export function useSettingsForm(preferences?: UserPreferences) {
  const toast = useToast();
  const [isPending, startTransition] = useTransition();

  // Initialize form with user preferences or defaults
  const form = useForm<SettingsForm>({
    defaultValues: {
      unit_system: preferences?.unit_system ?? settingsFormDefaultValues.unit_system,
    },
    mode: "onChange",
  });

  const { handleSubmit, reset } = form;

  const onSubmit = handleSubmit((data: SettingsForm) => {
    startTransition(async () => {
      try {
        await updateUserPreferences(data);
        toast.success("Settings saved successfully!");
        reset(data);
      } catch {
        toast.error("Failed to save settings. Please try again.");
      }
    });
  });

  return {
    // Form instance
    form,
    isPending,
    // Actions
    onSubmit,
  };
}
