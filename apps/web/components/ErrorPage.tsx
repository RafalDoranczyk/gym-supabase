"use client";

import { ReportProblemRounded } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";

type Props = {
  description?: string;
  reset?: () => void;
  title: string;
};

export function ErrorPage({ description, reset, title }: Props) {
  return (
    <Box alignItems="center" display="flex" height="100vh" justifyContent="center" px={2}>
      <Box
        alignItems="center"
        display="flex"
        flexDirection="column"
        gap={2}
        maxWidth={400}
        textAlign="center"
      >
        <ReportProblemRounded sx={{ color: "error.main", fontSize: 64 }} />

        <Typography color="error.main" fontWeight={600} variant="h5">
          {title}
        </Typography>

        {description && (
          <Typography color="text.secondary" variant="body2">
            {description}
          </Typography>
        )}

        <Box display="flex" flexWrap="wrap" gap={2} justifyContent="center" mt={1}>
          {reset && (
            <Button color="primary" onClick={() => reset()} variant="contained">
              Try again
            </Button>
          )}
          <Button color="secondary" href="/" variant="outlined">
            Go Home
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
