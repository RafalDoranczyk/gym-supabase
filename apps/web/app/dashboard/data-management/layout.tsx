import { Stack, Typography, Box } from "@mui/material";
import type React from "react";

export default function DataManagementLayout({ children }: React.PropsWithChildren) {
  return (
    <Box sx={{ p: 3 }}>
      <Stack spacing={4}>
        <Typography variant="h3" component="h1">
          Data Management
        </Typography>
        {children}
      </Stack>
    </Box>
  );
}
