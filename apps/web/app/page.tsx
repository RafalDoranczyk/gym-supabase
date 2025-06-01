import { loginWithGithub, loginWithGoogle } from "@/actions";
import { Analytics, FitnessCenter, GitHub, Google, Restaurant } from "@mui/icons-material";
import { Box, Button, Chip, Container, Paper, Stack, Typography } from "@mui/material";

export default function HomePage() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0A0B0E 0%, #141721 100%)",
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
            p: 6,
            borderRadius: 4,
            background: "linear-gradient(135deg, #141721 0%, #1A1F2E 100%)",
            border: "1px solid #1E293B",
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
                background: "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 32px rgba(139, 92, 246, 0.3)",
              }}
            >
              <FitnessCenter sx={{ fontSize: 40, color: "white" }} />
            </Box>

            <Stack spacing={1} alignItems="center">
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  background: "linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  mb: 1,
                }}
              >
                Gym Supabase
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
              icon={<Restaurant sx={{ fontSize: "18px !important" }} />}
              label="Nutrition"
              size="small"
              sx={{
                bgcolor: "rgba(139, 92, 246, 0.1)",
                color: "#A78BFA",
                border: "1px solid rgba(139, 92, 246, 0.2)",
              }}
            />
            <Chip
              icon={<FitnessCenter sx={{ fontSize: "18px !important" }} />}
              label="Workouts"
              size="small"
              sx={{
                bgcolor: "rgba(139, 92, 246, 0.1)",
                color: "#A78BFA",
                border: "1px solid rgba(139, 92, 246, 0.2)",
              }}
            />
            <Chip
              icon={<Analytics sx={{ fontSize: "18px !important" }} />}
              label="Analytics"
              size="small"
              sx={{
                bgcolor: "rgba(139, 92, 246, 0.1)",
                color: "#A78BFA",
                border: "1px solid rgba(139, 92, 246, 0.2)",
              }}
            />
          </Stack>

          {/* Auth Buttons */}
          <Stack spacing={2}>
            <Button
              onClick={loginWithGoogle}
              size="large"
              variant="contained"
              startIcon={<Google />}
              sx={{
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
              Continue with Google
            </Button>

            <Button
              onClick={loginWithGithub}
              size="large"
              variant="outlined"
              startIcon={<GitHub />}
              sx={{
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
