import {
  MeasurementsPageOverview,
  fetchMeasurementTypes,
  fetchMeasurements,
} from "@/modules/measurements";

export default async function MeasurementsPage() {
  const [measurementTypes, measurements] = await Promise.all([
    fetchMeasurementTypes(),
    fetchMeasurements(),
  ]);

  // await new Promise((resolve) => setTimeout(resolve, 3000)); // Simulate loading delay

  return (
    <MeasurementsPageOverview
      measurements={measurements.data}
      measurementTypes={measurementTypes}
      measurementsCount={measurements.count}
    />
  );
}
