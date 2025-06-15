import { calculatePhaseTargets, getMacroPercentages } from "@/modules/nutrition-goals";
import {
  AccessTime,
  CheckCircle,
  EmojiEvents,
  Grain,
  LocalFireDepartment,
  LocalOffer,
  FitnessCenter as ProteinIcon,
  Restaurant,
  RestaurantMenu,
  Schedule,
  Speed,
  Timeline,
  TrendingUp,
} from "@mui/icons-material";
import { Alert, Avatar, Box, Chip, Grid, LinearProgress, Paper, Typography } from "@mui/material";
import type {
  CreateIngredientGroupPayload,
  CreateMealTagPayload,
  FitnessPhase,
  NutritionGoalsForm,
} from "@repo/schemas";
import { useMemo } from "react";
import {
  ACTIVITY_LEVELS_UI,
  FITNESS_PHASES_UI,
  getStarterIngredientsByGroup,
} from "../../constants";

type OnboardingSummaryStepProps = {
  selectedGroups: CreateIngredientGroupPayload[];
  selectedTags: CreateMealTagPayload[];
  nutritionGoals: NutritionGoalsForm;
};

export function OnboardingSummaryStep({
  selectedGroups,
  selectedTags,
  nutritionGoals,
}: OnboardingSummaryStepProps) {
  const getTotalIngredients = () => {
    return selectedGroups.reduce((total, group) => {
      const ingredients = getStarterIngredientsByGroup(group.name);
      return total + ingredients.length;
    }, 0);
  };

  // Calculate fresh targets for summary
  const calculatedTargets = useMemo(() => {
    const canCalculate =
      nutritionGoals.current_weight &&
      nutritionGoals.height &&
      nutritionGoals.age &&
      nutritionGoals.gender;

    if (canCalculate) {
      return calculatePhaseTargets(
        {
          weight: nutritionGoals.current_weight,
          height: nutritionGoals.height,
          age: nutritionGoals.age,
          gender: nutritionGoals.gender,
        },
        nutritionGoals.activity_level,
        nutritionGoals.current_phase
      );
    }
    return null;
  }, [
    nutritionGoals.current_weight,
    nutritionGoals.height,
    nutritionGoals.age,
    nutritionGoals.gender,
    nutritionGoals.activity_level,
    nutritionGoals.current_phase,
  ]);

  const macroPercentages = calculatedTargets ? getMacroPercentages(calculatedTargets) : null;
  const totalIngredients = getTotalIngredients();

  const getGroupIngredientCount = (groupName: string) => {
    const ingredients = getStarterIngredientsByGroup(groupName);
    return ingredients.length;
  };

  // Get fitness phase display info
  const getPhaseInfo = (phase: FitnessPhase) => {
    const phaseData = FITNESS_PHASES_UI.find((p) => p.id === phase);
    // biome-ignore lint/style/noNonNullAssertion: We are 100% sure there is this string in array
    if (!phaseData) return FITNESS_PHASES_UI.find((p) => p.id === "maintenance")!;
    return phaseData;
  };

  // Get activity level display info
  const getActivityInfo = (level: string) => {
    return (
      ACTIVITY_LEVELS_UI.find((a) => a.id === level) ||
      // biome-ignore lint/style/noNonNullAssertion: We are 100% sure there is this string in array
      ACTIVITY_LEVELS_UI.find((a) => a.id === "moderately_active")!
    );
  };

  const phaseInfo = getPhaseInfo(nutritionGoals.current_phase);
  const activityInfo = getActivityInfo(nutritionGoals.activity_level);

  // Calculate weight difference and timeline
  const weightDifference = Math.abs(nutritionGoals.target_weight - nutritionGoals.current_weight);
  const isLosing = nutritionGoals.target_weight < nutritionGoals.current_weight;
  const weeklyRate = phaseInfo.id === "cutting" ? 0.5 : phaseInfo.id === "bulking" ? 0.25 : 0;
  const estimatedWeeks = weeklyRate > 0 ? Math.round(weightDifference / weeklyRate) : 0;

  // Categorize tags for better organization
  const mealTimeTags = selectedTags.filter((tag) =>
    ["Breakfast", "Lunch", "Dinner", "Snack", "Brunch", "Late night"].includes(tag.name)
  );

  const dietTypeTags = selectedTags.filter((tag) =>
    ["Vegan", "Vegetarian", "Keto", "Low-carb", "High-protein", "Paleo", "Gluten-free"].includes(
      tag.name
    )
  );

  const prepTimeTags = selectedTags.filter((tag) => tag.name.includes("min"));

  return (
    <div>
      {/* Enhanced Header */}
      <Box textAlign="center" mb={4}>
        <Avatar
          sx={{
            bgcolor: "success.main",
            width: 64,
            height: 64,
            mx: "auto",
            mb: 2,
          }}
        >
          <EmojiEvents sx={{ fontSize: 32 }} />
        </Avatar>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Your Personalized Setup Is Ready!
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Everything is configured for your nutrition tracking journey
        </Typography>
      </Box>

      {/* Success Alert - More prominent feedback */}
      <Alert
        severity="success"
        icon={<CheckCircle />}
        sx={{
          mb: 4,
          py: 2,
          "& .MuiAlert-message": { width: "100%" },
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          gap={2}
        >
          <Typography variant="body1" fontWeight="medium">
            🎉 Perfect! Your nutrition tracker is fully configured and ready to use.
          </Typography>
          <Box display="flex" gap={2} flexWrap="wrap">
            <Chip label={`${totalIngredients} ingredients`} size="small" color="success" />
            <Chip label={`${selectedGroups.length} categories`} size="small" color="success" />
            <Chip label={`${selectedTags.length} tags`} size="small" color="success" />
          </Box>
        </Box>
      </Alert>

      {/* Progress Overview - Simplified */}
      <Paper
        elevation={0}
        sx={{
          p: 4,
          mb: 4,
          background: "linear-gradient(135deg, primary.dark 0%, primary.main 100%)",
          color: "white",
          borderRadius: 2,
        }}
      >
        <Typography variant="h5" fontWeight="bold" mb={3} textAlign="center">
          🎯 Your Nutrition Journey Overview
        </Typography>

        <Grid container spacing={3} textAlign="center">
          <Grid size={{ xs: 6, md: 3 }}>
            <Typography variant="h2" fontWeight="bold">
              {totalIngredients}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Ingredients Ready
            </Typography>
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <Typography variant="h2" fontWeight="bold">
              {selectedGroups.length}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Food Categories
            </Typography>
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <Typography variant="h2" fontWeight="bold">
              {selectedTags.length}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Meal Tags
            </Typography>
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <Typography variant="h2" fontWeight="bold">
              {calculatedTargets?.daily_calorie_target || "---"}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Daily Calories
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={3}>
        {/* Nutrition Goals - Enhanced with better visual hierarchy */}
        <Grid size={{ xs: 12 }}>
          <Paper elevation={2} sx={{ p: 4, bgcolor: "background.paper", borderRadius: 2 }}>
            <Box display="flex" alignItems="center" gap={2} mb={3}>
              <Avatar sx={{ bgcolor: phaseInfo.color, width: 48, height: 48 }}>
                {phaseInfo.icon}
              </Avatar>
              <Box flex={1}>
                <Typography variant="h5" fontWeight="bold">
                  Your {phaseInfo.name} Plan
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {phaseInfo.description}
                </Typography>
              </Box>
              <Chip label={activityInfo.name} color="primary" variant="outlined" icon={<Speed />} />
            </Box>

            <Grid container spacing={3}>
              {/* Weight Progress Visualization */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Box
                  sx={{
                    p: 3,
                    bgcolor: "rgba(16, 185, 129, 0.15)", // Subtle green tint for success/progress
                    border: 1,
                    borderColor: "rgba(16, 185, 129, 0.3)",
                    borderRadius: 2,
                  }}
                >
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    mb={2}
                    textAlign="center"
                    color="success.main"
                  >
                    Weight Goal Progress
                  </Typography>
                  <Box textAlign="center" mb={2}>
                    <Typography variant="h3" fontWeight="bold" color="primary.main">
                      {nutritionGoals.current_weight} → {nutritionGoals.target_weight} kg
                    </Typography>
                    <Typography variant="body1" color="text.secondary" mt={1}>
                      {isLosing ? "Lose" : "Gain"} {weightDifference.toFixed(1)} kg total
                    </Typography>
                  </Box>

                  <LinearProgress
                    variant="determinate"
                    value={5} // Small initial progress
                    sx={{
                      height: 12,
                      borderRadius: 6,
                      bgcolor: "grey.200",
                      "& .MuiLinearProgress-bar": {
                        borderRadius: 6,
                        bgcolor: phaseInfo.color,
                      },
                    }}
                  />

                  {estimatedWeeks > 0 && (
                    <Box display="flex" alignItems="center" justifyContent="center" gap={1} mt={2}>
                      <Schedule sx={{ fontSize: 16, color: "text.secondary" }} />
                      <Typography variant="body2" color="text.secondary">
                        Estimated timeline: ~{estimatedWeeks} weeks at {weeklyRate}kg/week
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Grid>

              {/* Daily Macro Targets */}
              {calculatedTargets && (
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box
                    sx={{
                      p: 3,
                      bgcolor: "rgba(139, 92, 246, 0.15)", // Subtle purple tint matching your theme
                      border: 1,
                      borderColor: "rgba(139, 92, 246, 0.3)",
                      borderRadius: 2,
                    }}
                  >
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      mb={2}
                      textAlign="center"
                      color="primary.light"
                    >
                      Daily Nutrition Targets
                    </Typography>

                    {/* Calories - prominent */}
                    <Box textAlign="center" mb={3}>
                      <LocalFireDepartment sx={{ fontSize: 32, color: "primary.main", mb: 1 }} />
                      <Typography variant="h3" fontWeight="bold" color="primary.main">
                        {calculatedTargets.daily_calorie_target}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        calories per day
                      </Typography>
                    </Box>

                    {/* Macros breakdown */}
                    <Grid container spacing={2}>
                      <Grid size={4}>
                        <Box textAlign="center">
                          <ProteinIcon sx={{ fontSize: 24, color: "info.main" }} />
                          <Typography variant="h6" fontWeight="bold" color="info.main">
                            {calculatedTargets.daily_protein_target}g
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Protein {macroPercentages ? `(${macroPercentages.protein}%)` : ""}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid size={4}>
                        <Box textAlign="center">
                          <Grain sx={{ fontSize: 24, color: "warning.main" }} />
                          <Typography variant="h6" fontWeight="bold" color="warning.main">
                            {calculatedTargets.daily_carbs_target}g
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Carbs {macroPercentages ? `(${macroPercentages.carbs}%)` : ""}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid size={4}>
                        <Box textAlign="center">
                          <RestaurantMenu sx={{ fontSize: 24, color: "success.main" }} />
                          <Typography variant="h6" fontWeight="bold" color="success.main">
                            {calculatedTargets.daily_fat_target}g
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Fats {macroPercentages ? `(${macroPercentages.fat}%)` : ""}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              )}
            </Grid>
          </Paper>
        </Grid>

        {/* Ingredient Categories - Fixed layout */}
        <Grid size={{ md: 6, xs: 12 }}>
          <Paper elevation={1} sx={{ p: 3, bgcolor: "background.paper", borderRadius: 2, mb: 2 }}>
            <Box display="flex" alignItems="center" gap={1} mb={3}>
              <Restaurant color="primary" />
              <Box flex={1}>
                <Typography variant="h6" fontWeight="bold">
                  Ingredient Library
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedGroups.length} categories • {totalIngredients} ingredients
                </Typography>
              </Box>
              <Chip icon={<CheckCircle />} label="Ready" size="small" color="success" />
            </Box>

            <Grid container spacing={1}>
              {selectedGroups.map((group) => {
                const count = getGroupIngredientCount(group.name);
                return (
                  <Grid key={group.name} size={6}>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        border: 1,
                        borderColor: group.color,
                        bgcolor: `${group.color}15`,
                        transition: "all 0.2s",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: 2,
                        },
                      }}
                    >
                      <Typography variant="subtitle2" fontWeight="bold" color={group.color}>
                        {group.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {count} ingredients
                      </Typography>
                    </Box>
                  </Grid>
                );
              })}
            </Grid>
          </Paper>
        </Grid>

        {/* Meal Tags - Fixed layout */}
        <Grid size={{ md: 6, xs: 12 }}>
          <Paper elevation={1} sx={{ p: 3, bgcolor: "background.paper", borderRadius: 2, mb: 2 }}>
            <Box display="flex" alignItems="center" gap={1} mb={3}>
              <LocalOffer color="primary" />
              <Box flex={1}>
                <Typography variant="h6" fontWeight="bold">
                  Meal Organization
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedTags.length} tags for smart filtering
                </Typography>
              </Box>
              <Chip icon={<CheckCircle />} label="Ready" size="small" color="success" />
            </Box>

            <Box display="flex" flexDirection="column" gap={2}>
              {/* Meal Times */}
              {mealTimeTags.length > 0 && (
                <Box>
                  <Typography variant="overline" fontWeight="bold" color="text.secondary">
                    Meal Times ({mealTimeTags.length})
                  </Typography>
                  <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
                    {mealTimeTags.map((tag) => (
                      <Chip
                        key={tag.name}
                        label={tag.name}
                        size="small"
                        sx={{ bgcolor: tag.color, color: "white", fontWeight: "medium" }}
                      />
                    ))}
                  </Box>
                </Box>
              )}

              {/* Diet Types */}
              {dietTypeTags.length > 0 && (
                <Box>
                  <Typography variant="overline" fontWeight="bold" color="text.secondary">
                    Diet Types ({dietTypeTags.length})
                  </Typography>
                  <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
                    {dietTypeTags.map((tag) => (
                      <Chip
                        key={tag.name}
                        label={tag.name}
                        size="small"
                        sx={{ bgcolor: tag.color, color: "white", fontWeight: "medium" }}
                      />
                    ))}
                  </Box>
                </Box>
              )}

              {/* Prep Times */}
              {prepTimeTags.length > 0 && (
                <Box>
                  <Typography variant="overline" fontWeight="bold" color="text.secondary">
                    Prep Time ({prepTimeTags.length})
                  </Typography>
                  <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
                    {prepTimeTags.map((tag) => (
                      <Chip
                        key={tag.name}
                        label={tag.name}
                        size="small"
                        icon={<AccessTime />}
                        sx={{ bgcolor: tag.color, color: "white", fontWeight: "medium" }}
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Next Steps Call-to-Action */}
      <Box mt={4}>
        <Paper
          elevation={1}
          sx={{
            p: 4,
            bgcolor: "background.paper",
            border: 1,
            borderColor: "success.light",
            borderRadius: 2,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Subtle accent line */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 4,
              bgcolor: "success.main",
            }}
          />

          <Typography variant="h6" fontWeight="bold" mb={3} textAlign="center" color="success.main">
            🚀 What Happens Next?
          </Typography>

          <Grid container spacing={3}>
            {[
              {
                icon: <Restaurant color="primary" />,
                title: "Start Creating Meals",
                description: "Use your ingredient library to build nutritious recipes",
              },
              {
                icon: <Timeline color="success" />,
                title: "Track Daily Progress",
                description: "Monitor calories and macros against your targets",
              },
              {
                icon: <TrendingUp color="warning" />,
                title: "Watch Your Progress",
                description: "See trends and achievements as you reach your goals",
              },
            ].map((item) => (
              <Grid key={item.title} size={{ xs: 12, md: 4 }}>
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  textAlign="center"
                  gap={1}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    transition: "all 0.2s",
                    "&:hover": {
                      bgcolor: "action.hover",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  <Avatar sx={{ bgcolor: "primary.light", mb: 1 }}>{item.icon}</Avatar>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.description}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Box>

      {/* Motivational Footer */}
      <Box textAlign="center" mt={4} py={3}>
        <Typography variant="h5" fontWeight="bold" mb={2} color="primary.main">
          Ready to Transform Your Nutrition! 🎉
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Click "Complete Setup" to start your personalized nutrition tracking journey.
        </Typography>
      </Box>
    </div>
  );
}
