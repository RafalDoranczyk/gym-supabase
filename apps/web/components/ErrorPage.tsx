"use client";

import { ReportProblemRounded, Home, Refresh, ExpandMore, BugReport } from "@mui/icons-material";
import {
  Box,
  Button,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Container,
  Stack,
} from "@mui/material";

type Props = {
  description?: string;
  reset?: () => void;
  title: string;
  showDetails?: boolean;
  errorCode?: string;
  digest?: string;
};

export function ErrorPage({
  description,
  reset,
  title,
  showDetails = false,
  errorCode,
  digest,
}: Props) {
  const handleReportBug = () => {
    // You could integrate with error reporting service here
    const errorInfo = {
      title,
      description,
      errorCode,
      digest,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
    };

    console.log("Bug report data:", errorInfo);
    // Could send to your error tracking service
    alert(
      "Error details logged to console. In production, this would be sent to our error tracking service.",
    );
  };

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
          {/* Error Icon */}
          <Box
            sx={{
              width: 120,
              height: 120,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #DC2626 0%, #EF4444 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 8px 32px rgba(220, 38, 38, 0.3)",
            }}
          >
            <ReportProblemRounded sx={{ fontSize: 60, color: "white" }} />
          </Box>

          {/* Error Code Chip */}
          {errorCode && (
            <Chip
              label={`Error: ${errorCode}`}
              size="small"
              sx={{
                bgcolor: "rgba(220, 38, 38, 0.1)",
                color: "#F87171",
                border: "1px solid rgba(220, 38, 38, 0.2)",
                fontFamily: "monospace",
              }}
            />
          )}

          {/* Error Title */}
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              color: "text.primary",
              mb: 1,
            }}
          >
            {title}
          </Typography>

          {/* Error Description */}
          {description && (
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                maxWidth: 500,
                lineHeight: 1.6,
                fontSize: "1.1rem",
              }}
            >
              {description}
            </Typography>
          )}

          {/* Action Buttons */}
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 3 }}>
            {reset && (
              <Button
                onClick={reset}
                size="large"
                variant="contained"
                startIcon={<Refresh />}
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
                Try Again
              </Button>
            )}

            <Button
              href="/"
              size="large"
              variant="outlined"
              startIcon={<Home />}
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
              Go Home
            </Button>

            <Button
              onClick={handleReportBug}
              size="large"
              variant="text"
              startIcon={<BugReport />}
              sx={{
                color: "#6B7280",
                "&:hover": {
                  backgroundColor: "rgba(107, 114, 128, 0.1)",
                },
              }}
            >
              Report Bug
            </Button>
          </Stack>

          {/* Debug Details (Development Only) */}
          {showDetails && (errorCode || digest) && (
            <Box sx={{ width: "100%", mt: 4 }}>
              <Accordion
                sx={{
                  bgcolor: "rgba(31, 41, 55, 0.5)",
                  border: "1px solid #374151",
                  "&:before": { display: "none" },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMore sx={{ color: "#9CA3AF" }} />}
                  sx={{
                    "& .MuiAccordionSummary-content": {
                      alignItems: "center",
                    },
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Debug Information
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack spacing={1} alignItems="flex-start">
                    {errorCode && (
                      <Typography variant="caption" sx={{ fontFamily: "monospace" }}>
                        <strong>Code:</strong> {errorCode}
                      </Typography>
                    )}
                    {digest && (
                      <Typography variant="caption" sx={{ fontFamily: "monospace" }}>
                        <strong>Digest:</strong> {digest}
                      </Typography>
                    )}
                    <Typography variant="caption" sx={{ fontFamily: "monospace" }}>
                      <strong>Time:</strong> {new Date().toISOString()}
                    </Typography>
                    <Typography variant="caption" sx={{ fontFamily: "monospace" }}>
                      <strong>URL:</strong>{" "}
                      {typeof window !== "undefined" ? window.location.href : "N/A"}
                    </Typography>
                  </Stack>
                </AccordionDetails>
              </Accordion>
            </Box>
          )}

          {/* Help Text */}
          <Typography variant="caption" color="text.disabled" sx={{ mt: 2, opacity: 0.7 }}>
            If this problem persists, please contact support or try refreshing the page.
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}
