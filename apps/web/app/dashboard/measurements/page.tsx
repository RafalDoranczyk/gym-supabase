import {
  MeasurementsPageContent,
  fetchMeasurementTypes,
  fetchMeasurements,
} from "@/modules/measurements";

export default async function MeasurementsPage() {
  const [measurements, measurementTypes] = await Promise.all([
    fetchMeasurements(),
    fetchMeasurementTypes(),
  ]);

  return (
    <MeasurementsPageContent
      measurements={measurements.data}
      measurementTypes={measurementTypes.data}
      measurementsCount={measurements.count}
    />
  );
}
