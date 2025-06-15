import { PageHeader } from "@/components";
import {
  CurrentWeightCard,
  GoalProgressCard,
  LatestMeasurementsCard,
  MeasurementPageContent,
  WeeklyStatsCard,
  fetchMeasurementTypes,
  fetchMeasurements,
} from "@/modules/measurement";
import { Grid, Stack } from "@mui/material";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Measurements",
  description: "Track fitness progress with body measurements, weight tracking, and visual charts.",
};

export default async function Measurements() {
  const [{ data: measurements }, { data: measurementTypes }] = await Promise.all([
    fetchMeasurements(),
    fetchMeasurementTypes(),
  ]);

  return (
    <>
      <PageHeader.Root
        title="Measurements"
        description="Track your fitness progress with detailed measurements and charts."
      />

      <Stack spacing={4}>
        {/* Server-side rendered cards */}
        <Grid container spacing={{ xs: 2, sm: 3 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <CurrentWeightCard measurements={measurements} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <GoalProgressCard measurements={measurements} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <WeeklyStatsCard measurements={measurements} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <LatestMeasurementsCard measurements={measurements} />
          </Grid>
        </Grid>

        {/* Client-side interactive section */}
        <MeasurementPageContent measurements={measurements} measurementTypes={measurementTypes} />
      </Stack>
    </>
  );
}
