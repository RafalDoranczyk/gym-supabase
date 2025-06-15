import { markOnboardingComplete } from "@/modules/user-settings/actions/updateUserSettings";
import type {
  CreateIngredientGroupPayload,
  CreateMealTagPayload,
  NutritionGoalsForm,
} from "@repo/schemas";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type OnboardingStore = {
  // State
  selectedGroups: CreateIngredientGroupPayload[];
  selectedTags: CreateMealTagPayload[];
  nutritionGoals: NutritionGoalsForm;
  currentStep: number;

  // Actions
  setGroups: (groups: CreateIngredientGroupPayload[]) => void;
  setTags: (tags: CreateMealTagPayload[]) => void;
  setNutritionGoals: (goals: NutritionGoalsForm) => void;
  setStep: (step: number) => void;
  setOnboardingComplete: () => Promise<void>;
  reset: () => void;
};

const STORE_NAME = "onboarding-storage";

// Default nutrition goals values
const defaultNutritionGoals: NutritionGoalsForm = {
  current_phase: "maintenance",
  activity_level: "moderately_active",
  gender: "male",
  age: 25,
  height: 175,
  current_weight: 70,
  target_weight: 70,
  daily_calorie_target: undefined,
  daily_protein_target: undefined,
  daily_carbs_target: undefined,
  daily_fat_target: undefined,
  weekly_weight_change_target: undefined,
};

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set) => ({
      // Initial state
      currentStep: 0,
      selectedGroups: [],
      selectedTags: [],
      nutritionGoals: defaultNutritionGoals,

      // Actions
      setStep: (step) => set({ currentStep: step }),

      setGroups: (groups) => set({ selectedGroups: groups }),

      setTags: (tags) => set({ selectedTags: tags }),

      setNutritionGoals: (goals) => set({ nutritionGoals: goals }),

      setOnboardingComplete: async () => {
        await markOnboardingComplete();
      },

      reset: () =>
        set({
          currentStep: 0,
          selectedGroups: [],
          selectedTags: [],
          nutritionGoals: defaultNutritionGoals,
        }),
    }),
    {
      name: STORE_NAME,
      storage: createJSONStorage(() => localStorage),
    }
  )
);
