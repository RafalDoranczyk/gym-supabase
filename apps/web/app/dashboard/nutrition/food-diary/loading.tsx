import { FoodDiaryLeftColumnSkeleton, FoodDiarySidebarSkeleton } from "@/modules/food-diary";
import { Grid } from "@mui/material";

export default function FoodDiaryPageLoading() {
  return (
    <Grid container spacing={4}>
      <Grid size={{ xs: 12, xl: 7, xxl: 5 }}>
        <FoodDiaryLeftColumnSkeleton />
      </Grid>

      <Grid ml="auto" size={{ xs: 12, xl: 5 }}>
        <FoodDiarySidebarSkeleton />
      </Grid>
    </Grid>
  );
}
