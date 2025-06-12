import { loginWithGithub, loginWithGoogle } from "@/actions";
import { APP_NAME } from "@/constants";
import { Analytics, FitnessCenter, GitHub, Google, Restaurant } from "@mui/icons-material";
import { Box, Button, Chip, Container, Paper, Stack, Typography } from "@mui/material";

export default function HomePage() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={8}
          sx={{
            bgcolor: "background.default",
            p: 6,
            borderRadius: 4,
            textAlign: "center",
          }}
        >
          {/* Header */}
          <Stack spacing={3} alignItems="center" mb={4}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                bgcolor: "primary.main",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: 4,
              }}
            >
              <FitnessCenter sx={{ fontSize: 40, color: "primary.contrastText" }} />
            </Box>

            <Stack spacing={1} alignItems="center">
              <Typography
                variant="h3"
                color="primary"
                sx={{
                  fontWeight: 700,
                  mb: 1,
                }}
              >
                {APP_NAME}
              </Typography>

              <Typography
                variant="h6"
                color="text.secondary"
                sx={{ maxWidth: 400, lineHeight: 1.6 }}
              >
                Your complete nutrition and fitness tracking companion
              </Typography>
            </Stack>
          </Stack>

          {/* Features */}
          <Stack direction="row" spacing={2} justifyContent="center" mb={4}>
            <Chip
              icon={<Restaurant />}
              label="Nutrition"
              size="small"
              color="primary"
              variant="outlined"
            />
            <Chip
              icon={<FitnessCenter />}
              label="Workouts"
              size="small"
              color="primary"
              variant="outlined"
            />
            <Chip
              icon={<Analytics />}
              label="Analytics"
              size="small"
              color="primary"
              variant="outlined"
            />
          </Stack>

          {/* Auth Buttons */}
          <Stack spacing={2}>
            <Button
              onClick={loginWithGoogle}
              size="large"
              variant="contained"
              color="primary"
              startIcon={<Google />}
              sx={{
                py: 1.5,
                borderRadius: 3,
                "&:hover": {
                  transform: "translateY(-1px)",
                },
                transition: "all 0.3s ease",
              }}
            >
              Continue with Google
            </Button>

            <Button
              onClick={loginWithGithub}
              size="large"
              variant="outlined"
              color="primary"
              startIcon={<GitHub />}
              sx={{
                py: 1.5,
                borderRadius: 3,
                "&:hover": {
                  transform: "translateY(-1px)",
                },
                transition: "all 0.3s ease",
              }}
            >
              Continue with GitHub
            </Button>
          </Stack>

          {/* Footer */}
          <Typography variant="caption" color="text.disabled" sx={{ mt: 4, display: "block" }}>
            Track meals • Build muscle • Achieve goals
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}
