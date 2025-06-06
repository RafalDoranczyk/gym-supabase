"use client";

import { useToast } from "@/providers";
import { CheckCircle, Schedule, Settings } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Chip,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { UNIT_SYSTEM_OPTIONS, type UnitSystem } from "@repo/schemas";
import { useState, useTransition } from "react";
import { SettingsCard } from "./SettingsCard";

export function SettingsPageContent() {
  // State
  const [unitSystem, setUnitSystem] = useState<UnitSystem>("metric");
  const [isPending, startTransition] = useTransition();
  const [savedSuccessfully, setSavedSuccessfully] = useState(false);

  const toast = useToast();

  // Handle save
  const handleSave = () => {
    startTransition(async () => {
      try {
        // TODO: Replace with actual API call when actions are ready
        // await updateUserPreferences({ unit_system: unitSystem });

        // Simulate API call for now
        await new Promise((resolve) => setTimeout(resolve, 1000));

        toast.success("Settings saved successfully!");
        setSavedSuccessfully(true);

        // Hide success message after 3 seconds
        setTimeout(() => setSavedSuccessfully(false), 3000);
      } catch {
        toast.error("Failed to save settings. Please try again.");
      }
    });
  };

  return (
    <Box>
      {/* Success Alert */}
      {savedSuccessfully && (
        <Alert
          severity="success"
          sx={{
            mb: 3,
            backgroundColor: "success.dark",
            color: "success.contrastText",
            border: 1,
            borderColor: "success.main",
          }}
          icon={<CheckCircle />}
        >
          Your settings have been saved successfully!
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Main Settings */}
        <Grid
          size={{
            xs: 12,
            md: 8,
          }}
        >
          {/* Unit System Settings */}
          <SettingsCard
            title="Unit System"
            description="Choose your preferred measurement units for the application"
          >
            <Box>
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel id="unit-system-label">Unit System</InputLabel>
                <Select
                  labelId="unit-system-label"
                  value={unitSystem}
                  label="Unit System"
                  onChange={(e) => setUnitSystem(e.target.value as UnitSystem)}
                  sx={{
                    "& .MuiSelect-select": {
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    },
                  }}
                >
                  {UNIT_SYSTEM_OPTIONS.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography>{option.name}</Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Preview */}
              <Paper
                sx={{
                  p: 2,
                  backgroundColor: "rgba(255,255,255,0.05)",
                  border: 1,
                  borderColor: "divider",
                }}
              >
                <Typography variant="body2" color="primary.main" fontWeight={500} gutterBottom>
                  Preview
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {unitSystem === "metric"
                    ? "🏋️ Weight: 70 kg • 📏 Height: 175 cm • 🌡️ Temperature: 20°C"
                    : "🏋️ Weight: 154 lbs • 📏 Height: 5'9\" • 🌡️ Temperature: 68°F"}
                </Typography>
              </Paper>
            </Box>
          </SettingsCard>

          {/* Coming Soon Features */}
          <SettingsCard
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
                  icon: "🌍",
                  title: "Language & Region",
                  desc: "Localization and timezone settings",
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
                    backgroundColor: "rgba(255,255,255,0.02)",
                    border: 1,
                    borderColor: "rgba(255,255,255,0.1)",
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
          </SettingsCard>
        </Grid>

        {/* Sidebar */}
        <Grid size={{ xs: 12, md: 4 }}>
          {/* Quick Stats */}
          <SettingsCard title="Account Overview" description="Your current settings summary">
            <Stack spacing={2}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  p: 1.5,
                  backgroundColor: "rgba(255,255,255,0.05)",
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
                  backgroundColor: "rgba(255,255,255,0.05)",
                  borderRadius: 1,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Settings Configured
                </Typography>
                <Chip label="1 of 5" color="warning" size="small" />
              </Box>
            </Stack>
          </SettingsCard>

          {/* Save Button */}
          <Box position="sticky" top={20}>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={isPending}
              size="large"
              fullWidth
              startIcon={<Settings />}
              sx={{
                py: 1.5,
                fontWeight: 600,
                textTransform: "none",
                fontSize: "1rem",
              }}
            >
              {isPending ? "Saving Changes..." : "Save Settings"}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
