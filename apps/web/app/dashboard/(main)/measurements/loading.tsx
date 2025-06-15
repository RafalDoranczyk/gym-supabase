import { ChartSkeleton, PageHeader } from "@/components";
import { MeasurementStatCardSkeleton } from "@/modules/measurement";
import { Box, Grid, Paper, Skeleton } from "@mui/material";

// Skeleton for measurements list
function MeasurementListSkeleton() {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        border: (theme) => `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
      }}
    >
      {/* List header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2.5 }}>
        <Skeleton variant="text" width={140} height={28} />
        <Skeleton variant="rectangular" width={24} height={24} sx={{ borderRadius: 1 }} />
      </Box>

      {/* Measurement items */}
      {[1, 2, 3, 4, 5].map((el, index) => (
        <Box key={el}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              py: 2,
            }}
          >
            {/* Left side - measurement info */}
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width={80} height={20} sx={{ mb: 0.5 }} />
              <Skeleton variant="text" width={100} height={14} />
            </Box>

            {/* Right side - value and actions */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box sx={{ textAlign: "right" }}>
                <Skeleton variant="text" width={60} height={20} />
                <Skeleton variant="text" width={40} height={14} />
              </Box>
              <Box sx={{ display: "flex", gap: 0.5 }}>
                <Skeleton variant="rectangular" width={24} height={24} sx={{ borderRadius: 1 }} />
                <Skeleton variant="rectangular" width={24} height={24} sx={{ borderRadius: 1 }} />
              </Box>
            </Box>
          </Box>

          {index < 4 && <Skeleton variant="rectangular" width="100%" height={1} sx={{ my: 1 }} />}
        </Box>
      ))}

      {/* View all button */}
      <Skeleton variant="rectangular" width="100%" height={40} sx={{ mt: 2, borderRadius: 2 }} />
    </Paper>
  );
}

export default function MeasurementsLoading() {
  return (
    <>
      <PageHeader.Skeleton />

      {/* Quick Stats Skeleton */}
      <Box mb={4}>
        <Grid container spacing={{ xs: 2, sm: 3 }}>
          {[1, 2, 3].map((el) => (
            <Grid key={el} size={{ xs: 12, sm: 4 }}>
              <MeasurementStatCardSkeleton />
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Main Content Grid */}
      <Grid container spacing={{ xs: 2, lg: 3 }}>
        {/* Chart Section */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <ChartSkeleton />
        </Grid>

        {/* Measurements List */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <MeasurementListSkeleton />
        </Grid>
      </Grid>
    </>
  );
}
