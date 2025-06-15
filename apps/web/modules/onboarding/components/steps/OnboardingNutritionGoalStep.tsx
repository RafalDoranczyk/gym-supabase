import {
  type ActivityLevel,
  calculatePhaseTargets,
  type FitnessPhase,
  getMacroPercentages,
  type NutritionGoalsForm,
} from "@/modules/nutrition-goals";
import {
  FitnessCenter,
  Grain,
  LocalFireDepartment,
  FitnessCenter as ProteinIcon,
  Restaurant,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Paper,
  Radio,
  RadioGroup,
  Slider,
  TextField,
  Typography,
} from "@mui/material";
import { ACTIVITY_LEVELS_UI, FITNESS_PHASES_UI } from "../../constants";

type NutritionGoalsStepProps = {
  values: NutritionGoalsForm;
  onChange: (values: NutritionGoalsForm) => void;
  errors?: Partial<Record<keyof NutritionGoalsForm, string>>;
};

export function OnboardingNutritionGoalStep({ values, onChange, errors }: NutritionGoalsStepProps) {
  // Calculate targets when all required data is available
  const canCalculate = values.current_weight && values.height && values.age && values.gender;

  const calculatedTargets = canCalculate
    ? calculatePhaseTargets(
        {
          weight: values.current_weight,
          height: values.height,
          age: values.age,
          gender: values.gender,
        },
        values.activity_level,
        values.current_phase
      )
    : null;

  const macroPercentages = calculatedTargets ? getMacroPercentages(calculatedTargets) : null;

  const handlePhaseSelect = (phase: FitnessPhase) => {
    onChange({ ...values, current_phase: phase });
  };

  const handleActivitySelect = (activity: ActivityLevel) => {
    onChange({ ...values, activity_level: activity });
  };

  const handleInputChange =
    (field: keyof NutritionGoalsForm) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const value =
        event.target.type === "number"
          ? Number.parseFloat(event.target.value) || 0
          : event.target.value;

      onChange({ ...values, [field]: value });
    };

  const handleAgeSliderChange = (_: Event, value: number | number[]) => {
    onChange({ ...values, age: Array.isArray(value) ? value[0] : value });
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom fontWeight="bold">
        Nutrition Goals
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={2}>
        Set your fitness goal and parameters to get personalized calorie and macro targets. These
        calculations use proven formulas like Harris-Benedict and Mifflin-St Jeor equations to
        determine your optimal nutrition plan.
      </Typography>

      {/* Help text */}
      <Box mb={4} textAlign="center">
        <Typography variant="caption" color="text.secondary">
          💡 Tip: Don't worry about getting everything perfect - you can always adjust your goals
          and targets later in the Settings section
        </Typography>
      </Box>

      {/* Phase Selection */}
      <Box mb={4}>
        <Typography variant="h6" gutterBottom fontWeight="medium">
          Choose Your Goal
        </Typography>
        <Grid container spacing={2}>
          {FITNESS_PHASES_UI.map((phase) => (
            <Grid size={{ xs: 12, sm: 6 }} key={phase.id}>
              <Card
                variant={values.current_phase === phase.id ? "elevation" : "outlined"}
                elevation={values.current_phase === phase.id ? 4 : 0}
                sx={{
                  cursor: "pointer",
                  transition: "all 0.2s ease-in-out",
                  border: 2,
                  borderColor:
                    values.current_phase === phase.id ? `${phase.color}.main` : "divider",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    borderColor: `${phase.color}.light`,
                  },
                }}
                onClick={() => handlePhaseSelect(phase.id)}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" alignItems="flex-start" gap={2}>
                    <Avatar sx={{ bgcolor: `${phase.color}.main`, width: 48, height: 48 }}>
                      {phase.icon}
                    </Avatar>
                    <Box flex={1}>
                      <Typography variant="h6" fontWeight="bold" mb={1}>
                        {phase.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" mb={2}>
                        {phase.description}
                      </Typography>
                      <Box display="flex" gap={0.5} flexWrap="wrap">
                        {phase.benefits.map((benefit) => (
                          <Chip
                            key={benefit}
                            label={benefit}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: "0.7rem" }}
                          />
                        ))}
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* User Stats */}
      <Box mb={4}>
        <Typography variant="h6" gutterBottom fontWeight="medium">
          Your Parameters
        </Typography>
        <Grid container spacing={3}>
          {/* Gender */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl>
              <FormLabel>Gender</FormLabel>
              <RadioGroup value={values.gender} onChange={handleInputChange("gender")} row>
                <FormControlLabel value="male" control={<Radio />} label="Male" />
                <FormControlLabel value="female" control={<Radio />} label="Female" />
              </RadioGroup>
            </FormControl>
          </Grid>

          {/* Age Slider */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Box>
              <Typography variant="body2" color="text.secondary" mb={1}>
                Age: {values.age} years
              </Typography>
              <Slider
                value={values.age || 25}
                onChange={handleAgeSliderChange}
                min={13}
                max={80}
                step={1}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `${value} years`}
                sx={{ mt: 1 }}
              />
            </Box>
          </Grid>

          {/* Height */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Height (cm)"
              type="number"
              value={values.height || ""}
              onChange={handleInputChange("height")}
              error={!!errors?.height}
              helperText={errors?.height}
              fullWidth
              slotProps={{
                htmlInput: {
                  min: 100,
                  max: 250,
                },
              }}
            />
          </Grid>

          {/* Current Weight */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Current Weight (kg)"
              type="number"
              value={values.current_weight || ""}
              onChange={handleInputChange("current_weight")}
              error={!!errors?.current_weight}
              helperText={errors?.current_weight}
              fullWidth
              slotProps={{
                htmlInput: {
                  min: 30,
                  max: 200,
                  step: 0.5,
                },
              }}
            />
          </Grid>

          {/* Target Weight */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Target Weight (kg)"
              type="number"
              value={values.target_weight || ""}
              onChange={handleInputChange("target_weight")}
              error={!!errors?.target_weight}
              helperText={errors?.target_weight}
              fullWidth
              slotProps={{
                htmlInput: {
                  min: 30,
                  max: 200,
                  step: 0.5,
                },
              }}
            />
          </Grid>
        </Grid>
      </Box>

      {/* Activity Level */}
      <Box mb={4}>
        <Typography variant="h6" gutterBottom fontWeight="medium">
          Activity Level
        </Typography>
        <Grid container spacing={2}>
          {ACTIVITY_LEVELS_UI.map((level) => (
            <Grid
              size={{
                xl: 2.4, // 5 items per row on XL screens
                lg: 3, // 4 items per row on LG screens
                md: 4, // 3 items per row on MD screens
                sm: 6, // 2 items per row on SM screens
                xs: 12, // 1 item per row on XS screens
              }}
              key={level.id}
            >
              <Card
                variant={values.activity_level === level.id ? "elevation" : "outlined"}
                elevation={values.activity_level === level.id ? 2 : 0}
                sx={{
                  cursor: "pointer",
                  transition: "all 0.2s ease-in-out",
                  border: 1,
                  borderColor: values.activity_level === level.id ? "primary.main" : "divider",
                  height: "100%", // Make cards fill the grid height
                  display: "flex",
                  flexDirection: "column",
                  "&:hover": {
                    borderColor: "primary.light",
                  },
                }}
                onClick={() => handleActivitySelect(level.id)}
              >
                <CardContent
                  sx={{
                    p: 2,
                    flex: 1, // Fill available space
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between", // Space content evenly
                  }}
                >
                  <Box textAlign="center">
                    <Avatar
                      sx={{
                        bgcolor: values.activity_level === level.id ? "primary.main" : "grey.400",
                        width: 32,
                        height: 32,
                        mx: "auto",
                        mb: 1,
                      }}
                    >
                      <FitnessCenter fontSize="small" />
                    </Avatar>
                    <Typography variant="subtitle2" fontWeight="bold" mb={0.5}>
                      {level.name}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                      mb={1}
                      sx={{
                        minHeight: "2.4em", // Fixed height for description to keep alignment
                        lineHeight: 1.2,
                      }}
                    >
                      {level.description}
                    </Typography>
                  </Box>
                  <Box textAlign="center">
                    <Chip
                      label={level.multiplier}
                      size="small"
                      color={values.activity_level === level.id ? "primary" : "default"}
                      variant={values.activity_level === level.id ? "filled" : "outlined"}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Calculated Targets */}
      {calculatedTargets && (
        <Paper
          elevation={1}
          sx={{
            p: 3,
            bgcolor: "background.default",
            border: 1,
            borderColor: "divider",
          }}
        >
          <Typography variant="h6" gutterBottom fontWeight="medium">
            Your Daily Targets
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            These targets are calculated based on your goals, activity level, and body metrics. They
            serve as a starting point - you can fine-tune them later based on your progress.
          </Typography>

          <Grid container spacing={3}>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Box textAlign="center">
                <Box display="flex" alignItems="center" justifyContent="center" gap={1} mb={1}>
                  <LocalFireDepartment sx={{ color: "primary.main", fontSize: 20 }} />
                  <Typography variant="h4" fontWeight="bold" color="primary.main">
                    {calculatedTargets.daily_calorie_target}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  kcal
                </Typography>
              </Box>
            </Grid>

            <Grid size={{ xs: 6, sm: 3 }}>
              <Box textAlign="center">
                <Box display="flex" alignItems="center" justifyContent="center" gap={1} mb={1}>
                  <ProteinIcon sx={{ color: "info.main", fontSize: 20 }} />
                  <Typography variant="h4" fontWeight="bold" color="info.main">
                    {calculatedTargets.daily_protein_target}g
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  protein ({macroPercentages?.protein}%)
                </Typography>
              </Box>
            </Grid>

            <Grid size={{ xs: 6, sm: 3 }}>
              <Box textAlign="center">
                <Box display="flex" alignItems="center" justifyContent="center" gap={1} mb={1}>
                  <Grain sx={{ color: "warning.main", fontSize: 20 }} />
                  <Typography variant="h4" fontWeight="bold" color="warning.main">
                    {calculatedTargets.daily_carbs_target}g
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  carbs ({macroPercentages?.carbs}%)
                </Typography>
              </Box>
            </Grid>

            <Grid size={{ xs: 6, sm: 3 }}>
              <Box textAlign="center">
                <Box display="flex" alignItems="center" justifyContent="center" gap={1} mb={1}>
                  <Restaurant sx={{ color: "success.main", fontSize: 20 }} />
                  <Typography variant="h4" fontWeight="bold" color="success.main">
                    {calculatedTargets.daily_fat_target}g
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  fat ({macroPercentages?.fat}%)
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {calculatedTargets.weekly_weight_change_target !== 0 && (
            <>
              <Divider sx={{ my: 2 }} />
              <Box textAlign="center">
                <Typography variant="body2" color="text.secondary">
                  Expected weekly weight change:
                  <Typography
                    component="span"
                    fontWeight="bold"
                    color={
                      calculatedTargets.weekly_weight_change_target > 0
                        ? "success.main"
                        : "error.main"
                    }
                    sx={{ ml: 1 }}
                  >
                    {calculatedTargets.weekly_weight_change_target > 0 ? "+" : ""}
                    {calculatedTargets.weekly_weight_change_target}kg
                  </Typography>
                </Typography>
              </Box>
            </>
          )}

          {/* Additional info tip */}
          <Box
            mt={3}
            p={2}
            sx={{
              bgcolor: "primary.50",
              borderRadius: 1,
              border: 1,
              borderColor: "primary.200",
            }}
          >
            <Typography variant="body2" color="primary.dark" fontStyle="italic">
              🎯 <strong>Remember:</strong> These are starting targets based on established
              formulas. Your optimal intake may vary based on factors like metabolism, training
              intensity, sleep quality, and stress levels. Monitor your progress and adjust as
              needed.
            </Typography>
          </Box>
        </Paper>
      )}
    </Box>
  );
}
