import { useMemo } from "react";
import type { Measurement } from "../../schemas";
import { MeasurementStatCard } from "./MeasurementStatCard";

type GoalProgressCardProps = {
  measurements: Measurement[];
};

// Constants
const WEIGHT_GOAL_KG = 70;

function isWeightMeasurement(measurement: Measurement): boolean {
  return measurement.measurement_type_id === "weight";
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

function calculateOverallGoalProgress(
  currentWeight: number | null,
  totalMeasurements: number
): { progress: number; status: string } {
  if (!currentWeight) {
    return { progress: 0, status: "No data" };
  }

  const weightProgress = calculateWeightGoalProgress(currentWeight);

  // Combine weight progress with consistency (measurements frequency)
  const consistencyBonus = Math.min(totalMeasurements * 2, 20); // Up to 20% bonus for consistency
  const totalProgress = Math.min(weightProgress + consistencyBonus, 100);

  if (currentWeight <= WEIGHT_GOAL_KG) {
    return { progress: 100, status: "Goal achieved! 🎉" };
  }
  return {
    progress: totalProgress,
    status:
      totalProgress > 70 ? "Almost there!" : totalProgress > 40 ? "Good progress" : "Keep going!",
  };
}

export function GoalProgressCard({ measurements }: GoalProgressCardProps) {
  const stats = useMemo(() => {
    if (!measurements.length) {
      return {
        currentWeight: null,
        overallGoal: { progress: 0, status: "No data" },
      };
    }

    // Get latest weight measurement
    const weightMeasurements = measurements
      .filter(isWeightMeasurement)
      .sort((a, b) => new Date(b.measured_at).getTime() - new Date(a.measured_at).getTime());

    const currentWeight = weightMeasurements[0] || null;
    const overallGoal = calculateOverallGoalProgress(
      currentWeight?.value || null,
      measurements.length
    );

    return {
      currentWeight,
      overallGoal,
    };
  }, [measurements]);

  const getOverallGoalChange = () => {
    return {
      value: stats.overallGoal.status,
      trend: stats.overallGoal.progress > 70 ? ("up" as const) : ("neutral" as const),
    };
  };

  const formatGoalProgressValue = () => {
    if (!stats.currentWeight) return "No data";

    const currentWeight = stats.currentWeight.value;
    if (currentWeight <= WEIGHT_GOAL_KG) {
      return "Goal achieved!";
    }
    const remaining = currentWeight - WEIGHT_GOAL_KG;
    return `${remaining.toFixed(1)} kg to go`;
  };

  return (
    <MeasurementStatCard
      variant="goal-progress"
      value={formatGoalProgressValue()}
      change={getOverallGoalChange()}
      progress={stats.overallGoal.progress}
    />
  );
}
