import { WeightCard } from "@/modules/dashboard";
import { fetchMeasurements } from "@/modules/measurements";

export default async function Dashboard() {
  const { data } = await fetchMeasurements();

  return (
    <div>
      <WeightCard data={data} />
    </div>
  );
}
