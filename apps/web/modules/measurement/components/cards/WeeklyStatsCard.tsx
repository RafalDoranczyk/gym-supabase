import { useMemo } from "react";
import type { Measurement } from "../../schemas";
import { MeasurementStatCard } from "./MeasurementStatCard";

type WeeklyStatsCardProps = {
  measurements: Measurement[];
};

// Constants
const WEEKLY_MEASUREMENT_TARGET = 5; // Target measurements per week

function calculateWeeklyStats(measurements: Measurement[]) {
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay()); // Start of this week (Sunday)
  weekStart.setHours(0, 0, 0, 0);

  const lastWeekStart = new Date(weekStart);
  lastWeekStart.setDate(weekStart.getDate() - 7);

  const thisWeekMeasurements = measurements.filter((m) => {
    const measureDate = new Date(m.measured_at);
    return measureDate >= weekStart;
  });

  const lastWeekMeasurements = measurements.filter((m) => {
    const measureDate = new Date(m.measured_at);
    return measureDate >= lastWeekStart && measureDate < weekStart;
  });

  const thisWeekCount = thisWeekMeasurements.length;
  const lastWeekCount = lastWeekMeasurements.length;
  const diff = thisWeekCount - lastWeekCount;

  return {
    thisWeekCount,
    lastWeekCount,
    diff,
    progress: Math.min((thisWeekCount / WEEKLY_MEASUREMENT_TARGET) * 100, 100),
  };
}

export function WeeklyStatsCard({ measurements }: WeeklyStatsCardProps) {
  const stats = useMemo(() => {
    if (!measurements.length) {
      return {
        thisWeekCount: 0,
        lastWeekCount: 0,
        diff: 0,
        progress: 0,
      };
    }

    return calculateWeeklyStats(measurements);
  }, [measurements]);

  const getThisWeekChange = () => {
    const { diff } = stats;
    if (diff === 0) {
      return { value: "Same as last week", trend: "neutral" as const };
    }
    if (diff > 0) {
      return { value: `+${diff} vs last week`, trend: "up" as const };
    }
    return { value: `${diff} vs last week`, trend: "down" as const };
  };

  return (
    <MeasurementStatCard
      variant="this-week"
      value={`${stats.thisWeekCount} measurements`}
      change={getThisWeekChange()}
      progress={stats.progress}
    />
  );
}
