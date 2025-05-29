"use client";

import { Box, Button, Stack, Typography } from "@mui/material";
import Link from "next/link";

export default function NotFound() {
  return (
    <Box
      sx={{
        alignItems: "center",
        display: "flex",
        height: "100dvh",
        justifyContent: "center",
        px: 2,
        textAlign: "center",
      }}
    >
      <Stack spacing={3}>
        <Typography fontSize={{ sm: 80, xs: 60 }} fontWeight="bold" variant="h1">
          404
        </Typography>

        <Typography variant="h5">Page not found</Typography>

        <Typography color="text.secondary" variant="body1">
          Sorry, the page you are looking for doesn&apos;t exist or has been moved.
        </Typography>

        <Button component={Link} href="/" size="large" sx={{ mt: 2, px: 4 }} variant="contained">
          Go back home
        </Button>
      </Stack>
    </Box>
  );
}
