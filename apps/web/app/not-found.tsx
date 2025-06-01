"use client";

import { ArrowBack, Home, SearchOff } from "@mui/icons-material";
import { Box, Button, Container, Stack, Typography } from "@mui/material";

export default function NotFound() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0A0B0E 0%, #141721 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
      }}
    >
      <Container maxWidth="sm">
        <Stack spacing={4} alignItems="center" textAlign="center">
          {/* 404 Icon */}
          <Box
            sx={{
              width: 120,
              height: 120,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #1E293B 0%, #334155 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "2px solid #374151",
            }}
          >
            <SearchOff
              sx={{
                fontSize: 60,
                color: "#6B7280",
                opacity: 0.7,
              }}
            />
          </Box>

          {/* 404 Number */}
          <Typography
            sx={{
              fontSize: { xs: 80, sm: 120 },
              fontWeight: 800,
              background: "linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              lineHeight: 0.8,
              letterSpacing: "-0.02em",
            }}
          >
            404
          </Typography>

          {/* Error Messages */}
          <Stack spacing={2} maxWidth={400}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 600,
                color: "text.primary",
              }}
            >
              Page Not Found
            </Typography>

            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                lineHeight: 1.6,
                fontSize: "1.1rem",
              }}
            >
              Sorry, the page you're looking for doesn't exist or has been moved. Let's get you back
              on track with your fitness journey!
            </Typography>
          </Stack>

          {/* Action Buttons */}
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 3 }}>
            <Button
              href="/"
              size="large"
              variant="contained"
              startIcon={<Home />}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 3,
                background: "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)",
                "&:hover": {
                  background: "linear-gradient(135deg, #A78BFA 0%, #8B5CF6 100%)",
                  transform: "translateY(-1px)",
                  boxShadow: "0 8px 25px rgba(139, 92, 246, 0.4)",
                },
                transition: "all 0.3s ease",
              }}
            >
              Go Home
            </Button>

            <Button
              onClick={() => window.history.back()}
              size="large"
              variant="outlined"
              startIcon={<ArrowBack />}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 3,
                borderColor: "#374151",
                color: "#9CA3AF",
                "&:hover": {
                  borderColor: "#6B7280",
                  backgroundColor: "rgba(107, 114, 128, 0.1)",
                  transform: "translateY(-1px)",
                },
                transition: "all 0.3s ease",
              }}
            >
              Go Back
            </Button>
          </Stack>

          {/* Help Text */}
          <Typography
            variant="caption"
            color="text.disabled"
            sx={{
              mt: 2,
              opacity: 0.7,
            }}
          >
            Need help? Try searching for what you're looking for from the home page.
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}
