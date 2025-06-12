import { NutritionCardSkeleton } from "@/components";
import { Box, Grid, Skeleton } from "@mui/material";

export function FoodDiarySidebarSkeleton() {
  return (
    <Box>
      {/* Week Navigation */}
      <Box sx={{ bgcolor: "background.paper", borderRadius: 2, p: 2, mb: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Skeleton variant="circular" width={32} height={32} />
          <Skeleton variant="text" width={120} height={24} />
          <Skeleton variant="circular" width={32} height={32} />
        </Box>
        <Box display="flex" gap={1} justifyContent="center">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <Box key={i} textAlign="center">
              <Skeleton variant="text" width={24} height={16} sx={{ mx: "auto", mb: 0.5 }} />
              <Skeleton variant="circular" width={32} height={32} sx={{ mx: "auto" }} />
            </Box>
          ))}
        </Box>
      </Box>

      {/* Nutrition Cards */}
      <Grid container spacing={2}>
        {[1, 2, 3, 4].map((i) => (
          <Grid key={i} size={{ xs: 6 }}>
            <NutritionCardSkeleton />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
