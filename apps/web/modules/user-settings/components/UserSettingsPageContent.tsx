"use client";

import { ControlledSelect } from "@/components";
import { Schedule, Settings } from "@mui/icons-material";
import { Box, Button, Chip, Grid, Paper, Stack, Typography } from "@mui/material";
import { UNIT_SYSTEM_OPTIONS, type UnitSystem, type UserPreferences } from "@repo/schemas";
import { useSettingsForm } from "../hooks/useSettingsForm";
import { UserSettingsCard } from "./UserSettingsCard";

// Get preview text for unit system
const getUnitPreview = (unitSystem: UnitSystem) => {
  return unitSystem === "metric"
    ? "🏋️ Weight: 70 kg • 📏 Height: 175 cm • 🌡️ Temperature: 20°C"
    : "🏋️ Weight: 154 lbs • 📏 Height: 5'9\" • 🌡️ Temperature: 68°F";
};

type UserSettingsPageContentProps = {
  preferences: UserPreferences;
};

export function UserSettingsPageContent({ preferences }: UserSettingsPageContentProps) {
  const { form, isPending, onSubmit } = useSettingsForm(preferences);

  const { control, watch } = form;

  const unitSystem = watch("unit_system");

  return (
    <Box>
      <form onSubmit={onSubmit}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 8 }}>
            {/* Unit System Settings */}
            <UserSettingsCard
              title="Unit System"
              description="Choose your preferred measurement units for the application"
            >
              <Stack spacing={3}>
                <ControlledSelect
                  errorMessage={form.formState.errors.unit_system?.message}
                  control={control}
                  label="Unit System"
                  name="unit_system"
                  options={[...UNIT_SYSTEM_OPTIONS]}
                />

                {/* Preview */}
                <Paper
                  sx={{
                    p: 2,
                    backgroundColor: "action.hover",
                    border: 1,
                    borderColor: "divider",
                  }}
                >
                  <Typography variant="body2" color="primary.main" fontWeight={500} gutterBottom>
                    Preview
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {getUnitPreview(unitSystem)}
                  </Typography>
                </Paper>
              </Stack>
            </UserSettingsCard>

            {/* Coming Soon Features */}
            <UserSettingsCard
              title="Additional Settings"
              description="More customization options coming in future updates"
              variant="coming-soon"
            >
              <Stack spacing={2}>
                {[
                  {
                    icon: "🎯",
                    title: "Daily Calorie Goals",
                    desc: "Set personalized nutrition targets",
                  },
                  {
                    icon: "🔔",
                    title: "Notification Preferences",
                    desc: "Control when and how you receive alerts",
                  },
                  {
                    icon: "🔒",
                    title: "Security Options",
                    desc: "Account protection and privacy controls",
                  },
                ].map((feature) => (
                  <Box
                    key={feature.title}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      p: 1.5,
                      borderRadius: 1,
                      backgroundColor: "action.hover",
                      border: 1,
                      borderColor: "action.disabled",
                    }}
                  >
                    <Typography fontSize="1.5rem">{feature.icon}</Typography>
                    <Box flex={1}>
                      <Typography variant="body2" fontWeight={500}>
                        {feature.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {feature.desc}
                      </Typography>
                    </Box>
                    <Chip
                      label="Coming Soon"
                      size="small"
                      color="primary"
                      variant="outlined"
                      icon={<Schedule />}
                    />
                  </Box>
                ))}
              </Stack>
            </UserSettingsCard>
          </Grid>

          {/* Sidebar */}
          <Grid size={{ xs: 12, md: 4 }}>
            {/* Quick Stats */}
            <UserSettingsCard title="Account Overview" description="Your current settings summary">
              <Stack spacing={2}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    p: 1.5,
                    backgroundColor: "action.hover",
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Current Unit System
                  </Typography>
                  <Chip
                    label={unitSystem === "metric" ? "Metric" : "Imperial"}
                    color="primary"
                    size="small"
                  />
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    p: 1.5,
                    backgroundColor: "action.hover",
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Settings Configured
                  </Typography>
                  <Chip label="1 of 5" color="warning" size="small" />
                </Box>
              </Stack>
            </UserSettingsCard>

            {/* Action Buttons */}
            <Stack spacing={2} position="sticky" top={20}>
              <Button
                type="submit"
                variant="contained"
                loading={isPending}
                fullWidth
                startIcon={<Settings />}
              >
                {isPending ? "Saving Changes..." : "Save Settings"}
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
}
