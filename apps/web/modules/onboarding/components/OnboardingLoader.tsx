import { Restaurant } from "@mui/icons-material";
import {
  Avatar,
  Box,
  CircularProgress,
  Container,
  LinearProgress,
  Paper,
  Skeleton,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import { ONBOARDING_STEPS } from "../constants";

export function OnboardingLoader() {
  // Simulate progress - showing first 2 steps as completed, 3rd in progress
  const simulatedProgress = 2; // Steps completed so far
  const progressPercentage = ((simulatedProgress + 0.5) / ONBOARDING_STEPS.length) * 100; // 67%

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box textAlign="center" mb={6}>
        <Box display="flex" alignItems="center" justifyContent="center" mb={3}>
          <Avatar
            sx={{
              bgcolor: "primary.main",
              width: 64,
              height: 64,
              animation: "pulse 2s infinite",
              "@keyframes pulse": {
                "0%, 100%": { transform: "scale(1)" },
                "50%": { transform: "scale(1.05)" },
              },
            }}
          >
            <Restaurant sx={{ fontSize: 32 }} />
          </Avatar>
        </Box>

        <Typography variant="h3" gutterBottom fontWeight="bold">
          Welcome to Nutrition Tracker
        </Typography>
        <Typography variant="h6" color="text.secondary" mb={4}>
          Restoring your setup progress...
        </Typography>

        <Box sx={{ width: "100%", maxWidth: 400, mx: "auto" }}>
          <LinearProgress
            variant="determinate"
            value={progressPercentage}
            sx={{
              height: 8,
              borderRadius: 4,
              "& .MuiLinearProgress-bar": {
                transition: "transform 1.5s ease-out",
              },
            }}
          />
        </Box>
      </Box>

      {/* Stepper Preview using ONBOARDING_STEPS */}
      <Box mb={4}>
        <Stepper activeStep={simulatedProgress} alternativeLabel>
          {ONBOARDING_STEPS.map((step, index) => {
            const isCompleted = index < simulatedProgress;

            return (
              <Step key={step.id} completed={isCompleted}>
                <StepLabel icon={step.icon}>
                  <Typography variant="subtitle1" fontWeight="medium">
                    {step.label}
                  </Typography>
                </StepLabel>
              </Step>
            );
          })}
        </Stepper>
      </Box>

      {/* Content Skeleton */}
      <Paper elevation={2} sx={{ p: 4, minHeight: 400 }}>
        {/* Title skeleton */}
        <Skeleton variant="text" width="40%" height={40} sx={{ mb: 2 }} />

        {/* Subtitle skeleton */}
        <Skeleton variant="text" width="60%" height={24} sx={{ mb: 4 }} />

        {/* Cards skeleton */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 3,
          }}
        >
          {[...Array(4)].map((_, i) => (
            <Paper
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              key={i}
              variant="outlined"
              sx={{
                p: 3,
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Skeleton variant="circular" width={48} height={48} />
              <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" width="80%" height={20} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="60%" height={16} />
              </Box>
            </Paper>
          ))}
        </Box>
      </Paper>

      {/* Loading indicator */}
      <Box display="flex" justifyContent="center" alignItems="center" mt={4}>
        <CircularProgress size={24} sx={{ mr: 2 }} />
        <Typography variant="body2" color="text.secondary">
          Loading your nutrition preferences...
        </Typography>
      </Box>
    </Container>
  );
}
