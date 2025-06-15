"use client";

import { PATHS } from "@/constants";
import { useHydration } from "@/hooks";
import { calculatePhaseTargets } from "@/modules/nutrition-goals";
import { ArrowBack, ArrowForward, CheckCircle } from "@mui/icons-material";
import {
  Box,
  Button,
  Container,
  LinearProgress,
  Paper,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import type {
  CreateIngredientGroupPayload,
  CreateMealTagPayload,
  NutritionGoalsForm,
} from "@repo/schemas";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { completeOnboarding } from "../actions/completeOnboarding";
import { ONBOARDING_STEPS, TOTAL_ONBOARDING_STEPS } from "../constants";
import { useOnboardingStore } from "../hooks/useOnboardingStore";
import { OnboardingComplete } from "./OnboardingComplete";
import { OnboardingError } from "./OnboardingError";
import { OnboardingLoader } from "./OnboardingLoader";
import { OnboardingGroupStep } from "./steps/OnboardingGroupStep";
import { OnboardingNutritionGoalStep } from "./steps/OnboardingNutritionGoalStep";
import { OnboardingSummaryStep } from "./steps/OnboardingSummaryStep";
import { OnboardingTagStep } from "./steps/OnboardingTagStep";

export function OnboardingWizard() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const hydrated = useHydration();

  const {
    currentStep,
    selectedGroups,
    selectedTags,
    nutritionGoals,
    setStep,
    setGroups,
    setTags,
    setNutritionGoals,
    setOnboardingComplete,
  } = useOnboardingStore();

  if (!hydrated) {
    return <OnboardingLoader />;
  }

  if (isPending) {
    return <OnboardingComplete />;
  }

  if (error) {
    return (
      <OnboardingError
        error={error}
        onRetry={() => setError(null)}
        onSkip={() => router.push(PATHS.DASHBOARD)}
      />
    );
  }

  const handleBack = () => {
    const prevStep = Math.max(0, currentStep - 1);
    setStep(prevStep);
  };

  const handleGroupSelectionChange = (groups: CreateIngredientGroupPayload[]) => {
    setGroups(groups);
  };

  const handleTagSelectionChange = (tags: CreateMealTagPayload[]) => {
    setTags(tags);
  };

  const handleNutritionGoalsChange = (goals: NutritionGoalsForm) => {
    setNutritionGoals(goals);
  };

  const handleFinishSetup = () => {
    startTransition(async () => {
      try {
        setError(null); // Clear any previous errors

        // Calculate nutrition targets on-demand before saving
        const calculatedTargets = calculatePhaseTargets(
          {
            weight: nutritionGoals.current_weight,
            height: nutritionGoals.height,
            age: nutritionGoals.age,
            gender: nutritionGoals.gender,
          },
          nutritionGoals.activity_level,
          nutritionGoals.current_phase
        );

        const result = await completeOnboarding({
          groups: selectedGroups,
          tags: selectedTags,
          nutritionGoals: {
            ...nutritionGoals,
            ...calculatedTargets, // Merge calculated targets
          },
        });

        if (result.success) {
          await setOnboardingComplete();

          setTimeout(() => {
            router.push(PATHS.DASHBOARD);
          }, 2000);
        } else {
          setError("Setup failed. Please try again or contact support.");
        }
      } catch (error) {
        console.error("Setup failed:", error);
        setError("An unexpected error occurred. Please try again.");
      }
    });
  };

  const handleNext = () => {
    if (currentStep === TOTAL_ONBOARDING_STEPS - 1) {
      handleFinishSetup();
    } else {
      setStep(currentStep + 1);
    }
  };

  const getStepContent = () => {
    const stepId = ONBOARDING_STEPS[currentStep]?.id;

    switch (stepId) {
      case "ingredient-groups":
        return (
          <OnboardingGroupStep
            selectedGroups={selectedGroups}
            onSelectionChange={handleGroupSelectionChange}
          />
        );
      case "meal-tags":
        return (
          <OnboardingTagStep
            selectedTags={selectedTags}
            onSelectionChange={handleTagSelectionChange}
          />
        );
      case "nutrition-goals":
        return (
          <OnboardingNutritionGoalStep
            values={nutritionGoals}
            onChange={handleNutritionGoalsChange}
          />
        );
      case "setup-complete":
        return (
          <OnboardingSummaryStep
            selectedGroups={selectedGroups}
            selectedTags={selectedTags}
            nutritionGoals={nutritionGoals}
          />
        );
      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return selectedGroups.length > 0;
      case 1:
        return selectedTags.length > 0;
      case 2:
        return (
          nutritionGoals.age > 0 &&
          nutritionGoals.height > 0 &&
          nutritionGoals.current_weight > 0 &&
          nutritionGoals.target_weight > 0 &&
          nutritionGoals.gender &&
          nutritionGoals.activity_level &&
          nutritionGoals.current_phase
        );
      case 3:
        return true;
      default:
        return false;
    }
  };

  const getNextButtonText = () => {
    if (isPending) return "Setting up...";
    if (currentStep === TOTAL_ONBOARDING_STEPS - 1) return "Complete Setup";
    return "Next Step";
  };

  const getNextButtonIcon = () => {
    if (currentStep === TOTAL_ONBOARDING_STEPS - 1) return <CheckCircle />;
    return <ArrowForward />;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box textAlign="center" mb={6}>
        <Typography variant="h2" gutterBottom fontWeight="bold">
          Welcome to Nutrition Tracker
        </Typography>
        <Typography variant="h5" color="text.secondary">
          Let's set up your personalized nutrition database
        </Typography>
      </Box>

      {/* Stepper */}
      <Box mb={4}>
        <Stepper activeStep={currentStep} alternativeLabel>
          {ONBOARDING_STEPS.map(({ label, icon, description, id }, index) => {
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;

            return (
              <Step key={id} completed={isCompleted}>
                <StepLabel
                  icon={
                    <Box position="relative">
                      {icon}
                      {isCompleted && (
                        <Box
                          position="absolute"
                          top={-4}
                          right={-4}
                          sx={{
                            bgcolor: "success.main",
                            borderRadius: "50%",
                            width: 16,
                            height: 16,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <CheckCircle sx={{ fontSize: 12, color: "white" }} />
                        </Box>
                      )}
                    </Box>
                  }
                >
                  <Box>
                    <Box display="flex" alignItems="center" gap={1} justifyContent="center">
                      <Typography variant="subtitle1" fontWeight="medium">
                        {label}
                      </Typography>
                      {isCompleted && (
                        <Box
                          sx={{
                            bgcolor: "success.main",
                            color: "white",
                            borderRadius: 1,
                            px: 0.5,
                            py: 0.25,
                            fontSize: "0.6rem",
                            fontWeight: "bold",
                            lineHeight: 1,
                          }}
                        >
                          ✓
                        </Box>
                      )}
                      {isCurrent && (
                        <Box
                          sx={{
                            bgcolor: "primary.main",
                            color: "white",
                            borderRadius: 1,
                            px: 0.5,
                            py: 0.25,
                            fontSize: "0.6rem",
                            fontWeight: "bold",
                            lineHeight: 1,
                          }}
                        >
                          CURRENT
                        </Box>
                      )}
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {description}
                    </Typography>
                  </Box>
                </StepLabel>
              </Step>
            );
          })}
        </Stepper>
      </Box>

      {/* Progress */}
      <Box mb={4}>
        <LinearProgress
          variant="determinate"
          value={((currentStep + 1) / TOTAL_ONBOARDING_STEPS) * 100}
          sx={{ height: 8, borderRadius: 4 }}
        />
        <Typography variant="caption" color="text.secondary" mt={1} display="block">
          Step {currentStep + 1} of {TOTAL_ONBOARDING_STEPS}
        </Typography>
      </Box>

      {/* Content */}
      <Paper elevation={2} sx={{ p: 4, mb: 4, minHeight: 400 }}>
        {getStepContent()}
      </Paper>

      {/* Navigation */}
      <Box display="flex" justifyContent="space-between">
        <Button
          disabled={currentStep === 0}
          onClick={handleBack}
          variant="outlined"
          startIcon={<ArrowBack />}
          size="large"
        >
          Back
        </Button>

        <Button
          variant="contained"
          onClick={handleNext}
          disabled={!canProceed() || isPending}
          endIcon={getNextButtonIcon()}
          size="large"
          sx={{ minWidth: 140 }}
        >
          {getNextButtonText()}
        </Button>
      </Box>
    </Container>
  );
}
