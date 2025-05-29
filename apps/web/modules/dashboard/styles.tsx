import { Paper } from "@mui/material";
import type { PropsWithChildren } from "react";

export function DashboardCard({ children }: PropsWithChildren) {
  return (
    <Paper
      elevation={5}
      sx={{
        height: 300,
        p: 3,
        width: 400,
      }}
    >
      {children}
    </Paper>
  );
}
