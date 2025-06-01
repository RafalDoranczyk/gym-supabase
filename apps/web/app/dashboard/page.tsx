import { WeightCard } from "@/modules/dashboard";
import { getMeasurements } from "@/modules/measurements";

export default async function Dashboard() {
  const { data } = await getMeasurements();

  return (
    <div>
      <WeightCard data={data} />
    </div>
  );
}
