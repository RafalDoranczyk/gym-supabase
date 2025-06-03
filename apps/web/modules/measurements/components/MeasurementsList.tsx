import { formatDate } from "@/utils";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Sort as SortIcon,
  Visibility as ViewIcon,
} from "@mui/icons-material";
import { Box, Button, Divider, IconButton, Typography } from "@mui/material";
import type { MeasurementWithType } from "@repo/schemas";

type MeasurementsListProps = {
  measurements: MeasurementWithType[];
  onEdit: (measurement: MeasurementWithType) => void;
  onDelete: (measurement: MeasurementWithType) => void;
  onViewAll: () => void;
};

type MeasurementItemProps = {
  measurement: MeasurementWithType;
  onEdit: () => void;
  onDelete: () => void;
  isLast?: boolean;
};

// Helper function to get the actual unit string
function getDisplayUnit(measurement: MeasurementWithType): string {
  const { unit, measurement_type } = measurement;

  if (unit === "imperial" && measurement_type.unit_imperial) {
    return measurement_type.unit_imperial;
  }

  return measurement_type.unit_metric;
}

function MeasurementItem({ measurement, onEdit, onDelete, isLast }: MeasurementItemProps) {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          py: 2,
        }}
      >
        {/* Measurement Info */}
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="body1"
            sx={{
              fontWeight: 500,
              mb: 0.5,
              fontSize: "0.95rem",
            }}
          >
            {measurement.measurement_type.name}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: "#888",
              fontSize: "0.75rem",
            }}
          >
            {formatDate(new Date(measurement.measured_at))}
          </Typography>
        </Box>

        {/* Value & Actions */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography
            variant="body1"
            sx={{
              fontWeight: 600,
              fontSize: "1rem",
              minWidth: "60px",
              textAlign: "right",
            }}
          >
            {measurement.value} {getDisplayUnit(measurement)}
          </Typography>

          <Box sx={{ display: "flex", gap: 0.5 }}>
            <IconButton
              size="small"
              onClick={onEdit}
              sx={{
                color: "#888",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  color: "white",
                },
              }}
            >
              <EditIcon sx={{ fontSize: 16 }} />
            </IconButton>
            <IconButton
              size="small"
              onClick={onDelete}
              sx={{
                color: "#888",
                "&:hover": {
                  backgroundColor: "rgba(248, 113, 113, 0.1)",
                  color: "#f87171",
                },
              }}
            >
              <DeleteIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Box>
        </Box>
      </Box>

      {!isLast && <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.1)" }} />}
    </>
  );
}

export function MeasurementsList({
  measurements,
  onEdit,
  onDelete,
  onViewAll,
}: MeasurementsListProps) {
  // Sort measurements by date (newest first) and take only the most recent 5
  const recentMeasurements = [...measurements]
    .sort((a, b) => new Date(b.measured_at).getTime() - new Date(a.measured_at).getTime())
    .slice(0, 5);

  if (measurements.length === 0) {
    return (
      <Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              fontSize: "1.125rem",
            }}
          >
            Recent Measurements
          </Typography>
        </Box>

        <Box
          sx={{
            textAlign: "center",
            py: 6,
            color: "#666",
          }}
        >
          <Typography variant="body1" sx={{ mb: 1 }}>
            No measurements yet
          </Typography>
          <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>
            Add your first measurement to get started
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2.5,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            fontSize: "1.125rem",
          }}
        >
          Recent Measurements
        </Typography>
        <IconButton
          size="small"
          sx={{
            color: "#888",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            },
          }}
        >
          <SortIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Box>

      {/* Measurements List */}
      <Box>
        {recentMeasurements.map((measurement, index) => (
          <MeasurementItem
            key={measurement.id}
            measurement={measurement}
            onEdit={() => onEdit(measurement)}
            onDelete={() => onDelete(measurement)}
            isLast={index === recentMeasurements.length - 1}
          />
        ))}
      </Box>

      {/* View All Button */}
      {measurements.length > 5 && (
        <Button
          variant="outlined"
          fullWidth
          onClick={onViewAll}
          startIcon={<ViewIcon />}
          sx={{
            mt: 2,
            borderColor: "rgba(102, 126, 234, 0.3)",
            color: "#667eea",
            backgroundColor: "rgba(102, 126, 234, 0.1)",
            textTransform: "none",
            fontWeight: 500,
            "&:hover": {
              borderColor: "#667eea",
              backgroundColor: "rgba(102, 126, 234, 0.2)",
            },
          }}
        >
          View All Measurements ({measurements.length})
        </Button>
      )}
    </Box>
  );
}
