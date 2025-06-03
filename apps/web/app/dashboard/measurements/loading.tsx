"use client";
import { Box, Grid, Paper, Skeleton, Stack } from "@mui/material";

// Skeleton for individual stat card
function StatCardSkeleton() {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        minHeight: 160,
        border: (theme) => `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
      }}
    >
      {/* Header with icon and label */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2.5 }}>
        <Skeleton variant="rectangular" width={44} height={44} sx={{ borderRadius: 1.5 }} />
        <Skeleton variant="text" width={120} height={20} />
      </Box>

      {/* Main value */}
      <Skeleton variant="text" width={100} height={40} sx={{ mb: 1.5 }} />

      {/* Change indicator */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 2 }}>
        <Skeleton variant="rectangular" width={24} height={16} sx={{ borderRadius: 1 }} />
        <Skeleton variant="text" width={80} height={16} />
      </Box>

      {/* Progress bar */}
      <Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
          <Skeleton variant="text" width={80} height={12} />
          <Skeleton variant="text" width={30} height={12} />
        </Box>
        <Skeleton variant="rectangular" width="100%" height={6} sx={{ borderRadius: 3 }} />
      </Box>
    </Paper>
  );
}

// Skeleton for chart section
function ChartSkeleton() {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        border: (theme) => `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
      }}
    >
      {/* Chart header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Skeleton variant="text" width={150} height={28} />
        <Box sx={{ display: "flex", gap: 1 }}>
          {["1W", "1M", "3M", "1Y"].map((el) => (
            <Skeleton
              key={el}
              variant="rectangular"
              width={40}
              height={32}
              sx={{ borderRadius: 1 }}
            />
          ))}
        </Box>
      </Box>

      {/* Chart area */}
      <Box
        sx={{
          height: 300,
          position: "relative",
          overflow: "hidden",
          borderRadius: 2,
          border: (theme) => `1px solid ${theme.palette.divider}`,
        }}
      >
        {/* Animated chart lines */}
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "60%",
            background: "linear-gradient(180deg, transparent 0%, rgba(102, 126, 234, 0.1) 100%)",
          }}
        />

        {/* Chart skeleton bars */}
        <Box sx={{ display: "flex", alignItems: "end", height: "100%", gap: 2, p: 2 }}>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((el, index) => (
            <Skeleton
              key={el}
              variant="rectangular"
              sx={{
                flex: 1,
                height: `${Math.random() * 60 + 20}%`,
                borderRadius: "4px 4px 0 0",
                animation: `pulse 1.5s ease-in-out ${index * 0.1}s infinite`,
              }}
            />
          ))}
        </Box>

        {/* Center content */}
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
          }}
        >
          <Skeleton variant="circular" width={60} height={60} sx={{ mx: "auto", mb: 2 }} />
          <Skeleton variant="text" width={180} height={24} sx={{ mb: 1 }} />
          <Skeleton variant="text" width={240} height={16} sx={{ mb: 3 }} />
          <Skeleton variant="rectangular" width={160} height={40} sx={{ borderRadius: 3 }} />
        </Box>
      </Box>
    </Paper>
  );
}

// Skeleton for measurements list
function MeasurementsListSkeleton() {
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

// Main loading component
export default function MeasurementsLoadingPage() {
  return (
    <div>
      {/* Header Skeleton */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
        spacing={3}
        sx={{ mb: 4 }}
      >
        <Box sx={{ flex: 1, maxWidth: "60%" }}>
          <Skeleton variant="text" width={200} height={40} sx={{ mb: 1 }} />
          <Skeleton variant="text" width={300} height={20} />
        </Box>

        <Skeleton variant="rectangular" width={160} height={48} sx={{ borderRadius: 2 }} />
      </Stack>

      {/* Quick Stats Skeleton */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={{ xs: 2, sm: 3 }}>
          {[1, 2, 3].map((el) => (
            <Grid key={el} size={{ xs: 12, sm: 4 }}>
              <StatCardSkeleton />
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
          <MeasurementsListSkeleton />
        </Grid>
      </Grid>
    </div>
  );
}
