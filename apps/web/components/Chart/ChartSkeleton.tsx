import { Box, Paper, Skeleton } from "@mui/material";
import { CHART_TIME_FILTERS } from "./ChartTimeFilter";

export function ChartSkeleton() {
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
          {CHART_TIME_FILTERS.map((el) => (
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
