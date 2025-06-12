import type { Measurement } from "@repo/schemas";
import { useMemo } from "react";
import { MeasurementStatCard } from "./MeasurementStatCard";

type CurrentWeightCardProps = {
  measurements: Measurement[];
};

// Constants
const WEIGHT_GOAL_KG = 70;

// Helper functions
function getDisplayUnit(measurement: Measurement): string {
  if (measurement.measurement_type_id === "weight") return "kg";
  if (measurement.measurement_type_id === "waist") return "cm";
  if (measurement.measurement_type_id === "muscle_mass") return "kg";
  return "units";
}

function isWeightMeasurement(measurement: Measurement): boolean {
  return measurement.measurement_type_id === "weight";
}

function calculateWeightTrend(weightMeasurements: Measurement[]) {
  if (weightMeasurements.length < 2) return null;

  // Get current (latest) measurement
  const current = weightMeasurements[0];

  // Find measurement from ~1 week ago (7 days ± 2 days tolerance)
  const oneWeekAgo = new Date(current.measured_at);
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const weekOldMeasurement = weightMeasurements.find((m) => {
    const measureDate = new Date(m.measured_at);
    const diffDays = Math.abs(
      (oneWeekAgo.getTime() - measureDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    return diffDays <= 2; // Within 2 days of a week ago
  });

  // If no measurement from ~week ago, compare with previous measurement
  const previous = weekOldMeasurement || weightMeasurements[1];
  const diff = current.value - previous.value;
  const unit = getDisplayUnit(current);

  // Determine time period for display
  const timeDiff = Math.abs(
    new Date(current.measured_at).getTime() - new Date(previous.measured_at).getTime()
  );
  const daysDiff = Math.round(timeDiff / (1000 * 60 * 60 * 24));
  const timePeriod =
    daysDiff <= 1
      ? "since last measurement"
      : daysDiff <= 7
        ? "this week"
        : daysDiff <= 30
          ? `in ${daysDiff} days`
          : "recently";

  return {
    value: `${diff > 0 ? "+" : ""}${diff.toFixed(1)} ${unit} ${timePeriod}`,
    trend: diff > 0 ? ("up" as const) : diff < 0 ? ("down" as const) : ("neutral" as const),
  };
}

function calculateWeightGoalProgress(currentWeight: number | null): number {
  if (!currentWeight) return 0;

  // Assume starting weight was higher than goal, calculate progress toward goal
  const STARTING_WEIGHT = 80; // Assumed starting point

  if (currentWeight <= WEIGHT_GOAL_KG) {
    return 100; // Goal achieved or exceeded
  }

  const totalWeightToLose = STARTING_WEIGHT - WEIGHT_GOAL_KG;
  const weightLostSoFar = STARTING_WEIGHT - currentWeight;

  return Math.max(0, Math.min(100, (weightLostSoFar / totalWeightToLose) * 100));
}

export function CurrentWeightCard({ measurements }: CurrentWeightCardProps) {
  const stats = useMemo(() => {
    if (!measurements.length) {
      return {
        currentWeight: null,
        weightTrend: null,
        weightGoalProgress: 0,
      };
    }

    // Get weight measurements only
    const weightMeasurements = measurements
      .filter(isWeightMeasurement)
      .sort((a, b) => new Date(b.measured_at).getTime() - new Date(a.measured_at).getTime());

    const currentWeight = weightMeasurements[0] || null;

    // Calculate derived values
    const weightTrend = calculateWeightTrend(weightMeasurements);
    const weightGoalProgress = calculateWeightGoalProgress(currentWeight?.value || null);

    return {
      currentWeight,
      weightTrend,
      weightGoalProgress,
    };
  }, [measurements]);

  // Helper function for rendering stat values
  const formatMeasurementValue = (measurement: Measurement | null): string => {
    return measurement ? `${measurement.value} ${getDisplayUnit(measurement)}` : "No data";
  };

  return (
    <MeasurementStatCard
      variant="current-weight"
      value={formatMeasurementValue(stats.currentWeight)}
      change={stats.weightTrend ?? undefined}
      progress={stats.weightGoalProgress}
    />
  );
}
