import { Typography } from "@mui/material";

import { DashboardCard } from "./styles";

export function CaloriesCard() {
  return (
    <DashboardCard>
      <Typography variant="body1">Calories</Typography>
      <Typography variant="caption">2000</Typography>
      <Typography variant="caption">Protein</Typography>
      <Typography variant="caption">44</Typography>
      <Typography variant="caption">Fat</Typography>
      <Typography variant="caption">44</Typography>
      <Typography variant="caption">Carbs</Typography>
      <Typography variant="caption">44</Typography>
    </DashboardCard>
  );
}
