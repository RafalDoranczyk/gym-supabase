import { CheckCircle, Restaurant } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  Fade,
  Grow,
  Paper,
  Typography,
  Zoom,
} from "@mui/material";
import { useEffect, useState } from "react";

export function OnboardingComplete() {
  const [showContent, setShowContent] = useState(false);
  const [showText, setShowText] = useState(false);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    // Staggered animation timing
    setShowContent(true);
    const timer1 = setTimeout(() => setShowText(true), 300);
    const timer2 = setTimeout(() => setShowButton(true), 600);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Grow in={showContent} timeout={800}>
        <Paper elevation={3} sx={{ p: 6, textAlign: "center" }}>
          {/* Animated Avatar with MUI Zoom */}
          <Zoom in={showContent} timeout={1000}>
            <Avatar
              sx={{
                bgcolor: "success.main",
                width: 80,
                height: 80,
                mx: "auto",
                mb: 3,
                // Safe pulsing with only transform scale
                animation: "pulse 2s ease-in-out infinite",
                "@keyframes pulse": {
                  "0%, 100%": { transform: "scale(1)" },
                  "50%": { transform: "scale(1.05)" },
                },
              }}
            >
              <CheckCircle sx={{ fontSize: 48 }} />
            </Avatar>
          </Zoom>

          {/* Fade in text content */}
          <Fade in={showText} timeout={800}>
            <Box>
              <Typography variant="h3" gutterBottom fontWeight="bold">
                Setup Complete!
              </Typography>

              <Typography variant="h6" color="text.secondary" mb={4}>
                Your nutrition tracker is ready to use. Start creating meals and tracking your
                nutrition progress.
              </Typography>

              <Box mb={4}>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  Redirecting to your nutrition dashboard...
                </Typography>

                {/* Simple animated dots using CSS */}
                <Box
                  sx={{
                    display: "inline-block",
                    "& span": {
                      animation: "blink 1.4s infinite both",
                      fontSize: "1.2em",
                    },
                    "& span:nth-of-type(2)": { animationDelay: "0.2s" },
                    "& span:nth-of-type(3)": { animationDelay: "0.4s" },
                    "@keyframes blink": {
                      "0%, 80%, 100%": { opacity: 0 },
                      "40%": { opacity: 1 },
                    },
                  }}
                >
                  <span>•</span>
                  <span>•</span>
                  <span>•</span>
                </Box>
              </Box>
            </Box>
          </Fade>

          {/* Slide up button */}
          <Fade in={showButton} timeout={800}>
            <Button
              variant="contained"
              size="large"
              startIcon={
                <Box display="flex" alignItems="center" gap={1}>
                  <CircularProgress size={16} sx={{ color: "inherit" }} />
                  <Restaurant />
                </Box>
              }
              sx={{
                px: 4,
                py: 1.5,
                // Safe shimmer effect that doesn't affect layout
                position: "relative",
                overflow: "hidden",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: "-100%",
                  width: "100%",
                  height: "100%",
                  background:
                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
                  animation: "shimmer 2s infinite",
                },
                "@keyframes shimmer": {
                  "0%": { left: "-100%" },
                  "100%": { left: "100%" },
                },
              }}
              disabled
            >
              Loading Dashboard...
            </Button>
          </Fade>
        </Paper>
      </Grow>
    </Container>
  );
}
