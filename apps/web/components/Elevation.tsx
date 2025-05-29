import Paper from "@mui/material/Paper";
import type { PropsWithChildren } from "react";

export function Elevation({ children }: PropsWithChildren) {
  return (
    <Paper
      elevation={10}
      sx={{
        "&:hover": { boxShadow: 3 },
        bgcolor: "Background.paper",
      }}
    >
      {children}
    </Paper>
  );
}
