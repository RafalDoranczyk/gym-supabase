import { OnboardingWizard } from "@/modules/onboarding";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Setup - Nutrition Tracker",
  description:
    "Set up your nutrition tracking preferences, ingredient library and user preferences",
};

export default async function Setup() {
  return <OnboardingWizard />;
}
