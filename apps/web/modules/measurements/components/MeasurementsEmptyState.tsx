import { EmptyState } from "@/components";
import { Add } from "@mui/icons-material";
import { Button } from "@mui/material";

export function MeasurementsEmptyState() {
  return (
    <EmptyState
      title="No measurements recorded"
      subtitle="Start tracking your progress by adding your first measurement"
      action={
        <Button variant="outlined" startIcon={<Add />} onClick={() => openDrawer()}>
          Add Measurement
        </Button>
      }
    />
  );
}
