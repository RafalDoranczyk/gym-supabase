import { CountIndicator } from "@/components";
import { Add } from "@mui/icons-material";
import { Box, Button, Stack, Typography } from "@mui/material";

type MeasurementsToolbarProps = {
  measurementsCount: number;
  onAddMeasurement: () => void;
};

export function MeasurementsToolbar({
  measurementsCount,
  onAddMeasurement,
}: MeasurementsToolbarProps) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        mb: 3,
        flexDirection: { xs: "column", sm: "row" },
        gap: { xs: 2, sm: 0 },
      }}
    >
      {/* Title & Description */}
      <Box sx={{ flex: 1 }}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 1 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 600,
              fontSize: { xs: "1.75rem", md: "2.125rem" },
            }}
          >
            Measurements
          </Typography>
          <CountIndicator end={measurementsCount} />
        </Stack>
        <Typography variant="body2" color="text.secondary">
          Track your fitness progress with detailed measurements and charts.
        </Typography>
      </Box>

      {/* Add Button */}
      <Button
        aria-label="Add new measurement"
        onClick={onAddMeasurement}
        variant="contained"
        size="medium"
        startIcon={<Add />}
        sx={{
          borderRadius: 2,
          px: 3,
          py: 1,
          fontWeight: 600,
          boxShadow: 2,
          alignSelf: { xs: "stretch", sm: "flex-start" },
          "&:hover": {
            boxShadow: 4,
            transform: "translateY(-1px)",
          },
          transition: "all 0.2s",
        }}
      >
        Add Measurement
      </Button>
    </Box>
  );
}
