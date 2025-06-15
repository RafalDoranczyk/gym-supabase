import { useMemo } from "react";
import type { Measurement } from "../../schemas";
import { MeasurementStatCard } from "./MeasurementStatCard";

type LatestMeasurementsCardProps = {
  measurements: Measurement[];
};

function calculateLatestMeasurements(measurements: Measurement[]) {
  // Get all measurement types except weight
  const nonWeightMeasurements = measurements.filter((m) => m.measurement_type_id !== "weight");

  // Group by measurement type and get the latest for each
  const latestByType = new Map<string, Measurement>();

  for (const measurement of nonWeightMeasurements) {
    const typeId = measurement.measurement_type_id;
    const existing = latestByType.get(typeId);

    if (!existing || new Date(measurement.measured_at) > new Date(existing.measured_at)) {
      latestByType.set(typeId, measurement);
    }
  }

  const latestMeasurements = Array.from(latestByType.values());
  const sortedByDate = latestMeasurements.sort(
    (a, b) => new Date(b.measured_at).getTime() - new Date(a.measured_at).getTime()
  );

  // Calculate freshness based on most recent measurement
  let freshnessProgress = 0;
  if (sortedByDate.length > 0) {
    const mostRecent = sortedByDate[0];
    const daysSinceLastMeasurement = Math.floor(
      (Date.now() - new Date(mostRecent.measured_at).getTime()) / (1000 * 60 * 60 * 24)
    );

    // Freshness decreases over time: 100% if today, 80% if 1 day ago, etc.
    freshnessProgress = Math.max(0, Math.min(100, 100 - daysSinceLastMeasurement * 15));
  }

  return {
    count: latestMeasurements.length,
    latest: sortedByDate[0] || null,
    daysSinceLatest:
      sortedByDate.length > 0
        ? Math.floor(
            (Date.now() - new Date(sortedByDate[0].measured_at).getTime()) / (1000 * 60 * 60 * 24)
          )
        : 0,
    freshnessProgress,
    measurements: sortedByDate,
  };
}

export function LatestMeasurementsCard({ measurements }: LatestMeasurementsCardProps) {
  const stats = useMemo(() => {
    if (!measurements.length) {
      return {
        count: 0,
        latest: null,
        daysSinceLatest: 0,
        freshnessProgress: 0,
        measurements: [],
      };
    }

    return calculateLatestMeasurements(measurements);
  }, [measurements]);

  const getLatestMeasurementsChange = () => {
    const { count, daysSinceLatest } = stats;

    if (count === 0) {
      return { value: "No measurements yet", trend: "neutral" as const };
    }

    if (daysSinceLatest === 0) {
      return { value: "Updated today", trend: "up" as const };
    }

    if (daysSinceLatest === 1) {
      return { value: "Updated yesterday", trend: "neutral" as const };
    }

    if (daysSinceLatest <= 3) {
      return { value: `Updated ${daysSinceLatest} days ago`, trend: "neutral" as const };
    }

    return { value: `Updated ${daysSinceLatest} days ago`, trend: "down" as const };
  };

  return (
    <MeasurementStatCard
      variant="latest-measurements"
      value={`${stats.count} measurement types`}
      change={getLatestMeasurementsChange()}
      progress={stats.freshnessProgress}
    />
  );
}
