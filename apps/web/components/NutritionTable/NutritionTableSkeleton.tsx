import { Box, Skeleton } from "@mui/material";

const ROW_NUMBER = 10;

type NutritionTableSkeletonProps = {
  rowNumber?: number;
};

export function NutritionTableSkeleton({ rowNumber = ROW_NUMBER }: NutritionTableSkeletonProps) {
  return (
    <Box p={2}>
      <Skeleton
        sx={{ borderRadius: 4, display: "inline-block", height: 30, width: 100 }}
        variant="rectangular"
      />
      <Skeleton
        sx={{ borderRadius: 4, display: "inline-block", height: 30, ml: 2, width: 50 }}
        variant="rectangular"
      />

      {Array.from(Array(rowNumber).keys()).map((key) => (
        <Box key={key}>
          <Skeleton
            sx={{
              height: 40,
              mt: 2,
            }}
            variant="rectangular"
          />
          <Skeleton sx={{ height: 2, mt: 1 }} variant="rectangular" />
        </Box>
      ))}
    </Box>
  );
}
