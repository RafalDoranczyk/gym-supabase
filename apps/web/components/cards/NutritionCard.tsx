"use client";

import {
  CheckCircleRounded,
  FitnessCenterRounded,
  LocalFireDepartmentRounded,
  RestaurantRounded,
  TrendingUpRounded,
  WarningRounded,
  WaterDropRounded,
} from "@mui/icons-material";
import {
  Box,
  Card,
  Chip,
  IconButton,
  LinearProgress,
  Skeleton,
  Tooltip,
  Typography,
} from "@mui/material";
import CountUp from "react-countup";

export type NutritionData = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

export type NutritionGoals = NutritionData;

type NutrientStatus = "complete" | "close" | "good" | "low";

// Nutrition card configuration
const NUTRITION_CONFIG = {
  calories: {
    icon: LocalFireDepartmentRounded,
    emoji: "🔥",
    title: "Calories",
    unit: "",
    color: "#ef4444",
    lightColor: "#fef2f2",
    darkColor: "#991b1b",
    description: "Daily energy intake",
  },
  protein: {
    icon: FitnessCenterRounded,
    emoji: "💪",
    title: "Protein",
    unit: "g",
    color: "#06b6d4",
    lightColor: "#f0fdfa",
    darkColor: "#0891b2",
    description: "Muscle building",
  },
  carbs: {
    icon: WaterDropRounded,
    emoji: "🌾",
    title: "Carbs",
    unit: "g",
    color: "#8b5cf6",
    lightColor: "#faf5ff",
    darkColor: "#7c3aed",
    description: "Primary energy",
  },
  fat: {
    icon: RestaurantRounded,
    emoji: "🥑",
    title: "Fat",
    unit: "g",
    color: "#10b981",
    lightColor: "#f0fdf4",
    darkColor: "#059669",
    description: "Essential fats",
  },
} as const;

// Helper function to calculate progress percentage
function getNutrientProgress(consumed: number, goal: number): number {
  return Math.min((consumed / goal) * 100, 100);
}

// Helper function to get status
function getNutrientStatus(consumed: number, goal: number): NutrientStatus {
  const progress = (consumed / goal) * 100;
  if (progress >= 100) return "complete";
  if (progress >= 80) return "close";
  if (progress >= 50) return "good";
  return "low";
}

// Helper function to format number
function formatNutrient(value: number, unit: string): string {
  return `${Math.round(value)}${unit}`;
}

function getStatusText(status: NutrientStatus) {
  switch (status) {
    case "complete":
      return "Goal reached!";
    case "close":
      return "Almost there";
    case "good":
      return "Good progress";
    case "low":
      return "Need more";
    default:
      return "";
  }
}

function getStatusIcon(status: NutrientStatus, color: string) {
  switch (status) {
    case "complete":
      return <CheckCircleRounded fontSize="small" sx={{ color }} />;
    case "close":
      return <TrendingUpRounded fontSize="small" sx={{ color }} />;
    case "low":
      return <WarningRounded fontSize="small" color="warning" />;
    default:
      return null;
  }
}

// Individual nutrition card component
type NutritionCardProps = {
  type: keyof NutritionData;
  consumed: number;
  goal: number;
  previousDay?: number;
  showRemaining?: boolean;
  onClick?: () => void;
};

export function NutritionCard({
  type,
  consumed,
  goal,
  previousDay,
  showRemaining = false,
  onClick,
}: NutritionCardProps) {
  const { color, darkColor, unit, title, description, emoji } = NUTRITION_CONFIG[type];

  const progress = getNutrientProgress(consumed, goal);
  const status = getNutrientStatus(consumed, goal);

  const remaining = Math.max(goal - consumed, 0);
  const isOverGoal = consumed > goal;

  // Calculate change from previous day
  const hasComparison = previousDay !== undefined;
  const change = hasComparison ? consumed - previousDay : 0;
  const changePercent = hasComparison && previousDay > 0 ? (change / previousDay) * 100 : 0;

  return (
    <Card
      onClick={onClick}
      sx={{
        background: "rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        borderRadius: 2,
        p: 3,
        position: "relative",
        overflow: "hidden",
        cursor: onClick ? "pointer" : "default",

        // Top colored border
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: `linear-gradient(90deg, ${color}, ${darkColor})`,
          borderRadius: "12px 12px 0 0",
        },

        "&:hover": {
          boxShadow: `0 8px 24px ${color}20`,
          background: "rgba(255, 255, 255, 0.08)",
          borderColor: `${color}40`,
        },

        // Status-based styling
        ...(status === "complete" && {
          background: `linear-gradient(135deg, ${color}10, rgba(255, 255, 255, 0.05))`,
          borderColor: `${color}30`,
        }),
      }}
    >
      {/* Card Header */}
      <Box display="flex" alignItems="flex-start" mb={3}>
        {/* Icon Container */}
        <Box
          width={56}
          height={56}
          borderRadius={2}
          display="flex"
          alignItems="center"
          justifyContent="center"
          mr={2}
          fontSize={28}
          position="relative"
          sx={{
            background: `linear-gradient(135deg, ${color}20, ${color}10)`,
            "&::after": {
              content: '""',
              position: "absolute",
              inset: -1,
              borderRadius: 2,
              background: `linear-gradient(135deg, ${color}, ${darkColor})`,
              mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              maskComposite: "xor",
              WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor",
            },
          }}
        >
          {emoji}
        </Box>

        {/* Content */}
        <Box flex={1} minWidth={0}>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
            <Typography variant="h3" fontWeight={700} lineHeight={1}>
              <CountUp delay={0} duration={0.4} end={consumed} start={0} />
              {/* {formatNutrient(consumed, unit)} */}
              {unit}
            </Typography>
            {getStatusIcon(status, color)}
          </Box>

          <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
            of {formatNutrient(goal, unit)} {title.toLowerCase()}
          </Typography>

          <Typography variant="caption" color="textSecondary">
            {description}
          </Typography>
        </Box>
      </Box>

      {/* Progress Section */}
      <Box mb={2}>
        <Box position="relative" mb={1.5}>
          <LinearProgress
            variant="determinate"
            value={progress} // Direct value, no animation
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: "rgba(255, 255, 255, 0.1)",
              "& .MuiLinearProgress-bar": {
                borderRadius: 4,
                background: isOverGoal
                  ? `linear-gradient(90deg, ${color}, #ef4444)`
                  : `linear-gradient(90deg, ${color}, ${darkColor})`,
                // REMOVED: All transitions and shimmer animations
              },
            }}
          />

          {/* Progress percentage */}
          <Typography
            variant="caption"
            position="absolute"
            right={0}
            top={-20}
            color={color}
            fontWeight={600}
          >
            {Math.round(progress)}%
          </Typography>
        </Box>

        {/* Status and Remaining */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          {/* Status */}
          <Chip
            label={getStatusText(status)}
            size="small"
            sx={{
              height: 24,
              fontSize: "0.7rem",
              fontWeight: 600,
              background: `${color}20`,
              color,
              border: `1px solid ${color}30`,
            }}
          />

          {/* Remaining or Exceeded */}
          {showRemaining && (
            <Typography
              variant="caption"
              color={isOverGoal ? "error.light" : "rgba(255, 255, 255, 0.7)"}
              fontWeight={500}
            >
              {isOverGoal
                ? `+${formatNutrient(consumed - goal, unit)} over`
                : `${formatNutrient(remaining, unit)} left`}
            </Typography>
          )}
        </Box>
      </Box>

      {/* Comparison with previous day */}
      {hasComparison && change !== 0 && (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          pt={2}
          borderTop="1px solid rgba(255, 255, 255, 0.1)"
        >
          <Typography variant="caption" color="rgba(255, 255, 255, 0.5)" fontSize="0.7rem">
            vs yesterday
          </Typography>

          <Box display="flex" alignItems="center" gap={0.5}>
            <TrendingUpRounded
              fontSize="small"
              color={change > 0 ? "success" : "error"}
              sx={{
                transform: change < 0 ? "rotate(180deg)" : "none",
              }}
            />
            <Typography
              variant="caption"
              color={change > 0 ? "success.light" : "error.light"}
              fontWeight={600}
              fontSize="0.7rem"
            >
              {change > 0 ? "+" : ""}
              {formatNutrient(Math.abs(change), unit)}
              {Math.abs(changePercent) > 0 && (
                <Box component="span" sx={{ opacity: 0.7 }}>
                  {" "}
                  (
                  {Math.abs(changePercent) > 1
                    ? Math.round(changePercent)
                    : changePercent.toFixed(1)}
                  %)
                </Box>
              )}
            </Typography>
          </Box>
        </Box>
      )}

      {/* Click indicator */}
      {onClick && (
        <Tooltip title={`View ${title} details`}>
          <IconButton
            size="small"
            sx={{
              position: "absolute",
              top: 12,
              right: 12,
              color: "rgba(255, 255, 255, 0.5)",
              "&:hover": {
                color,
                background: `${color}20`,
              },
            }}
          >
            <TrendingUpRounded fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
    </Card>
  );
}

export function NutritionCardSkeleton() {
  return (
    <Card sx={{ p: 2 }}>
      <Box display="flex" alignItems="center" gap={1} mb={2}>
        <Skeleton variant="circular" width={24} height={24} />
        <Box flex={1}>
          <Skeleton variant="text" width="80%" height={20} />
          <Skeleton variant="text" width="60%" height={16} />
        </Box>
        <Skeleton variant="circular" width={20} height={20} />
      </Box>

      <Box mb={2}>
        <Skeleton variant="text" width="40%" height={32} />
        <Skeleton variant="text" width="60%" height={16} />
      </Box>

      {/* Progress bar */}
      <Skeleton variant="rounded" width="100%" height={8} sx={{ mb: 1 }} />

      <Box display="flex" justifyContent="space-between">
        <Skeleton variant="text" width="30%" height={16} />
        <Skeleton variant="text" width="30%" height={16} />
      </Box>
    </Card>
  );
}
