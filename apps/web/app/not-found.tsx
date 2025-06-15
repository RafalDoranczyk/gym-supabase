import { ArrowBack, Home, SearchOff } from "@mui/icons-material";
import { Box, Button, Container, Stack, Typography } from "@mui/material";

export default function NotFound() {
  return (
    <Box
      minHeight="100vh"
      bgcolor="grey.900"
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={2}
    >
      <Container maxWidth="sm">
        <Stack spacing={4} alignItems="center" textAlign="center">
          {/* 404 Icon */}
          <Box
            width={120}
            height={120}
            borderRadius="50%"
            bgcolor="grey.800"
            display="flex"
            alignItems="center"
            justifyContent="center"
            border={2}
            borderColor="grey.700"
          >
            <SearchOff
              sx={{
                fontSize: 60,
                color: "grey.500",
              }}
            />
          </Box>

          {/* 404 Number */}
          <Typography
            variant="h1"
            fontWeight={800}
            color="primary.main"
            sx={{
              fontSize: { xs: 80, sm: 120 },
              lineHeight: 0.8,
              letterSpacing: "-0.02em",
            }}
          >
            404
          </Typography>

          {/* Error Messages */}
          <Stack spacing={2} maxWidth={400}>
            <Typography variant="h4" fontWeight={600} color="text.primary">
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
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mt={3}>
            <Button
              href="/"
              size="large"
              variant="contained"
              color="primary"
              startIcon={<Home />}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 3,
                "&:hover": {
                  transform: "translateY(-1px)",
                },
                transition: "all 0.3s ease",
              }}
            >
              Go Home
            </Button>

            {/* Server Component friendly back button */}
            <Button
              href="javascript:history.back()"
              size="large"
              variant="outlined"
              color="inherit"
              startIcon={<ArrowBack />}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 3,
                color: "grey.400",
                borderColor: "grey.600",
                "&:hover": {
                  borderColor: "grey.500",
                  backgroundColor: "grey.800",
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
            mt={2}
            sx={{
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
