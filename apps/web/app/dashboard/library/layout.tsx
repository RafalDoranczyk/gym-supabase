import { Box, Stack, Typography } from "@mui/material";
import type React from "react";

export default function LibraryLayout({ children }: React.PropsWithChildren) {
  return (
    <Box sx={{ p: 3 }}>
      <Stack spacing={4}>
        <Stack spacing={1}>
          <Typography variant="h3" component="h1">
            Library
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage ingredient groups, meal categories, and measurement types for your nutrition
            tracking.
          </Typography>
        </Stack>
        {children}
      </Stack>
    </Box>
  );
}
