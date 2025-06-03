import { Scale, Straighten, Timeline, TrendingDown, TrendingUp } from "@mui/icons-material";
import { Box, Grid, LinearProgress, Paper, Typography } from "@mui/material";
import { Tooltip } from "@mui/material";
import type { MeasurementType, MeasurementWithType } from "@repo/schemas";
import { useMemo } from "react";

type MeasurementsQuickStatsProps = {
  measurements: MeasurementWithType[];
  measurementTypes: MeasurementType[];
};

type StatCardProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
  change?: {
    value: string;
    trend: "up" | "down" | "neutral";
  };
  progress?: number;
  iconGradient: string;
};

// Helper function to get the actual unit string
function getDisplayUnit(measurement: MeasurementWithType): string {
  const { unit, measurement_type } = measurement;

  if (unit === "imperial" && measurement_type.unit_imperial) {
    return measurement_type.unit_imperial;
  }

  return measurement_type.unit_metric;
}

function StatCard({ icon, label, value, change, progress, iconGradient }: StatCardProps) {
  const getTrendIcon = (trend: "up" | "down" | "neutral") => {
    switch (trend) {
      case "up":
        return <TrendingUp sx={{ fontSize: 14 }} />;
      case "down":
        return <TrendingDown sx={{ fontSize: 14 }} />;
      default:
        return null;
    }
  };

  const getTrendColor = (trend: "up" | "down" | "neutral") => {
    switch (trend) {
      case "up":
        return "#4ade80";
      case "down":
        return "#f87171";
      default:
        return "#94a3b8";
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        minHeight: 180,
        position: "relative",
        overflow: "hidden",
        border: (theme) => `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        transition: "all 0.2s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: (theme) => theme.shadows[4],
          borderColor: "primary.main",
        },
      }}
    >
      {/* Background Decoration */}
      <Box
        sx={{
          position: "absolute",
          top: -10,
          right: -10,
          width: 60,
          height: 60,
          background: iconGradient,
          borderRadius: "50%",
          opacity: 0.08,
          zIndex: 0,
        }}
      />

      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          mb: 2.5,
          position: "relative",
          zIndex: 1,
        }}
      >
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: 1.5,
            background: iconGradient,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            boxShadow: `0 4px 15px ${
              iconGradient.includes("#667eea")
                ? "rgba(102, 126, 234, 0.25)"
                : iconGradient.includes("#f093fb")
                  ? "rgba(240, 147, 251, 0.25)"
                  : "rgba(79, 172, 254, 0.25)"
            }`,
          }}
        >
          {icon}
        </Box>
        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            fontWeight: 500,
            fontSize: "0.875rem",
          }}
        >
          {label}
        </Typography>
      </Box>

      {/* Main Value */}
      <Box sx={{ position: "relative", zIndex: 1 }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            mb: 1.5,
            fontSize: { xs: "1.5rem", sm: "1.75rem" },
            background: iconGradient,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            display: "inline-block",
          }}
        >
          {value}
        </Typography>

        {/* Change Indicator */}
        {change && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              mb: progress !== undefined ? 2 : 0,
            }}
          >
            <Box
              sx={{
                color: getTrendColor(change.trend),
                display: "flex",
                alignItems: "center",
                p: 0.5,
                borderRadius: 1,
                backgroundColor: `${getTrendColor(change.trend)}15`,
              }}
            >
              {getTrendIcon(change.trend)}
            </Box>
            <Typography
              variant="caption"
              sx={{
                color: getTrendColor(change.trend),
                fontSize: "0.8rem",
                fontWeight: 600,
              }}
            >
              {change.value}
            </Typography>
          </Box>
        )}

        {progress !== undefined && (
          <Tooltip
            title={
              <Box sx={{ p: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                  Goal Progress Details
                </Typography>
                <Typography variant="caption" sx={{ display: "block" }}>
                  Progress based on number of measurements
                </Typography>
                <Typography variant="caption" sx={{ display: "block" }}>
                  Current: {value}
                </Typography>
              </Box>
            }
            arrow
            placement="top"
          >
            <Box sx={{ mt: 1, cursor: "help" }}>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: (theme) => theme.palette.action.hover,
                  "& .MuiLinearProgress-bar": {
                    background: iconGradient,
                    borderRadius: 3,
                    boxShadow: `0 0 8px ${
                      iconGradient.includes("#667eea")
                        ? "rgba(102, 126, 234, 0.4)"
                        : iconGradient.includes("#f093fb")
                          ? "rgba(240, 147, 251, 0.4)"
                          : "rgba(79, 172, 254, 0.4)"
                    }`,
                  },
                }}
              />
            </Box>
          </Tooltip>
        )}
      </Box>
    </Paper>
  );
}

export function MeasurementsQuickStats({
  measurements,
  measurementTypes,
}: MeasurementsQuickStatsProps) {
  const stats = useMemo(() => {
    if (!measurements.length) {
      return {
        currentWeight: null,
        latestMeasurement: null,
        goalProgress: 0,
      };
    }

    const sortedMeasurements = [...measurements].sort(
      (a, b) => new Date(b.measured_at).getTime() - new Date(a.measured_at).getTime(),
    );

    const latestWeight = sortedMeasurements.find((m) =>
      m.measurement_type.name.toLowerCase().includes("weight"),
    );

    const latestMeasurement = sortedMeasurements[0];

    const weightMeasurements = measurements
      .filter((m) => m.measurement_type.name.toLowerCase().includes("weight"))
      .sort((a, b) => new Date(b.measured_at).getTime() - new Date(a.measured_at).getTime());

    let weightTrend = null;
    if (weightMeasurements.length >= 2) {
      const current = weightMeasurements[0];
      const previous = weightMeasurements[1];
      const diff = current.value - previous.value;
      const unit = getDisplayUnit(current);

      weightTrend = {
        value: `${diff > 0 ? "+" : ""}${diff.toFixed(1)} ${unit} this week`,
        trend: diff > 0 ? ("up" as const) : diff < 0 ? ("down" as const) : ("neutral" as const),
      };
    }

    const goalProgress = Math.min((measurements.length / 10) * 100, 100);

    return {
      currentWeight: latestWeight,
      latestMeasurement,
      goalProgress,
      weightTrend,
    };
  }, [measurements]);

  return (
    <Box sx={{ mb: 4 }}>
      <Grid container spacing={{ xs: 2, sm: 3 }}>
        {/* Current Weight */}
        <Grid size={{ xs: 12, sm: 4 }}>
          <StatCard
            icon={<Scale sx={{ fontSize: 20 }} />}
            label="Current Weight"
            value={
              stats.currentWeight
                ? `${stats.currentWeight.value} ${getDisplayUnit(stats.currentWeight)}`
                : "No data"
            }
            change={stats.weightTrend ?? undefined}
            progress={stats.currentWeight ? 65 : 0}
            iconGradient="linear-gradient(135deg, #667eea, #764ba2)"
          />
        </Grid>

        {/* Latest Measurement */}
        <Grid size={{ xs: 12, sm: 4 }}>
          <StatCard
            icon={<Straighten sx={{ fontSize: 20 }} />}
            label="Latest Measurement"
            value={
              stats.latestMeasurement
                ? `${stats.latestMeasurement.value} ${getDisplayUnit(stats.latestMeasurement)}`
                : "No data"
            }
            change={
              measurements.length >= 2
                ? {
                    value: "Updated recently",
                    trend: "neutral" as const,
                  }
                : undefined
            }
            iconGradient="linear-gradient(135deg, #f093fb, #f5576c)"
          />
        </Grid>

        {/* Goal Progress */}
        <Grid size={{ xs: 12, sm: 4 }}>
          <StatCard
            icon={<Timeline sx={{ fontSize: 20 }} />}
            label="Goal Progress"
            value={`${Math.round(stats.goalProgress)}%`}
            change={{
              value: measurements.length > 5 ? "On track" : "Keep going!",
              trend: measurements.length > 5 ? "up" : "neutral",
            }}
            progress={stats.goalProgress}
            iconGradient="linear-gradient(135deg, #4facfe, #00f2fe)"
          />
        </Grid>
      </Grid>
    </Box>
  );
}
