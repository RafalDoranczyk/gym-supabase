import { Box, Skeleton, Stack } from "@mui/material";
import { FoodDiaryMealCardSkeleton } from "./FoodDiaryMealCardSkeleton";

export function FoodDiaryLeftColumnSkeleton() {
  return (
    <Stack spacing={3}>
      {/* Meal Cards Skeletons */}
      <FoodDiaryMealCardSkeleton />
      <FoodDiaryMealCardSkeleton />

      {/* Add Button Skeleton */}
      <Box display="flex" justifyContent="center">
        <Skeleton variant="rounded" width={180} height={40} sx={{ borderRadius: 2 }} />
      </Box>
    </Stack>
  );
}
