import { CaloriesCard, TrainingCard, WeightCard } from "@/modules/dashboard";
import { getMeasurements } from "@/modules/measurements";
import { Stack, Typography } from "@mui/material";

export default async function Dashboard() {
  const { data } = await getMeasurements();

  return (
    <div>
      {/* <Stack direction="row" spacing={2}> */}
      <WeightCard data={data} />
      {/* <CaloriesCard />
        <TrainingCard /> */}
      {/* </Stack> */}
    </div>
  );
}
