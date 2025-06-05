import {
  Assessment,
  Scale,
  Straighten,
  Timeline,
  TrendingDown,
  TrendingUp,
} from "@mui/icons-material";
import { Box, Card, LinearProgress, Tooltip, Typography } from "@mui/material";

type StatCardProps = {
  variant: "current-weight" | "this-week" | "goal-progress" | "latest-measurements";
  value: string;
  change?: {
    value: string;
    trend: "up" | "down" | "neutral";
  };
  progress?: number;
};

export function MeasurementStatCard({ variant, value, change, progress }: StatCardProps) {
  const getVariantConfig = (
    variant: "current-weight" | "this-week" | "goal-progress" | "latest-measurements"
  ) => {
    switch (variant) {
      case "current-weight":
        return {
          label: "Current Weight",
          icon: <Scale sx={{ fontSize: 20 }} />,
          gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          shadowColor: "rgba(102, 126, 234, 0.25)",
          glowColor: "rgba(102, 126, 234, 0.4)",
        };
      case "this-week":
        return {
          label: "This Week",
          icon: <Straighten sx={{ fontSize: 20 }} />,
          gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
          shadowColor: "rgba(240, 147, 251, 0.25)",
          glowColor: "rgba(240, 147, 251, 0.4)",
        };
      case "goal-progress":
        return {
          label: "Goal Progress",
          icon: <Timeline sx={{ fontSize: 20 }} />,
          gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
          shadowColor: "rgba(79, 172, 254, 0.25)",
          glowColor: "rgba(79, 172, 254, 0.4)",
        };
      case "latest-measurements":
        return {
          label: "Latest Measurements",
          icon: <Assessment sx={{ fontSize: 20 }} />,
          gradient: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
          shadowColor: "rgba(17, 153, 142, 0.25)",
          glowColor: "rgba(17, 153, 142, 0.4)",
        };
      default:
        return {
          label: "Current Weight",
          icon: <Scale sx={{ fontSize: 20 }} />,
          gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          shadowColor: "rgba(102, 126, 234, 0.25)",
          glowColor: "rgba(102, 126, 234, 0.4)",
        };
    }
  };

  const config = getVariantConfig(variant);

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
    <Card
      sx={{
        p: 3,
        minHeight: 180,
        position: "relative",
        overflow: "hidden",
        borderRadius: 2,
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
          background: config.gradient,
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
            background: config.gradient,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            boxShadow: `0 4px 15px ${config.shadowColor}`,
          }}
        >
          {config.icon}
        </Box>
        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            fontWeight: 500,
            fontSize: "0.875rem",
          }}
        >
          {config.label}
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
            background: config.gradient,
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
                  {variant === "current-weight"
                    ? "Weight Goal Progress"
                    : variant === "this-week"
                      ? "Weekly Tracking Progress"
                      : variant === "latest-measurements"
                        ? "Measurement Freshness"
                        : "Goal Progress Details"}
                </Typography>
                <Typography variant="caption" sx={{ display: "block" }}>
                  {variant === "current-weight"
                    ? "Progress toward your weight goal"
                    : variant === "this-week"
                      ? "Measurement frequency this week"
                      : variant === "latest-measurements"
                        ? "How recent your measurements are"
                        : "Overall goal achievement progress"}
                </Typography>
                <Typography variant="caption" sx={{ display: "block" }}>
                  Current: {value}
                </Typography>
                {variant === "current-weight" && (
                  <Typography variant="caption" sx={{ display: "block" }}>
                    Target: 70 kg
                  </Typography>
                )}
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
                    background: config.gradient,
                    borderRadius: 3,
                    boxShadow: `0 0 8px ${config.glowColor}`,
                  },
                }}
              />
            </Box>
          </Tooltip>
        )}
      </Box>
    </Card>
  );
}
