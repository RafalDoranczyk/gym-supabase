"use client";

import {
  BugReport,
  ExpandMore,
  Home,
  Lightbulb,
  Refresh,
  ReportProblemRounded,
} from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

type Props = {
  description?: string;
  reset?: () => void;
  title: string;
  showDetails?: boolean;
  errorCode?: string;
  digest?: string;
  technicalDetails?: Record<string, unknown>;
  suggestions?: string[];
};

export function ErrorPage({
  description,
  reset,
  title,
  showDetails = false,
  errorCode,
  digest,
  technicalDetails,
  suggestions,
}: Props) {
  const handleReportBug = () => {
    const errorInfo = {
      title,
      description,
      errorCode,
      digest,
      technicalDetails,
      url: typeof window !== "undefined" ? window.location.href : "N/A",
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "N/A",
      timestamp: new Date().toISOString(),
    };

    console.log("Bug report data:", errorInfo);
    // In production, send to error tracking service
    alert(
      "Error details logged to console. In production, this would be sent to our error tracking service."
    );
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={8}
          sx={{
            p: 6,
            borderRadius: 4,
            textAlign: "center",
          }}
        >
          <Stack spacing={4} alignItems="center">
            {/* Error Icon */}
            <Box
              sx={{
                width: 120,
                height: 120,
                borderRadius: "50%",
                bgcolor: "error.main",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: 6,
              }}
            >
              <ReportProblemRounded sx={{ fontSize: 60, color: "error.contrastText" }} />
            </Box>

            {/* Error Code Chip */}
            {errorCode && (
              <Chip
                label={`Error: ${errorCode}`}
                size="small"
                color="error"
                variant="outlined"
                sx={{
                  fontFamily: "monospace",
                  fontWeight: 600,
                }}
              />
            )}

            {/* Error Title */}
            <Typography
              variant="h3"
              color="text.primary"
              sx={{
                fontWeight: 700,
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
                  maxWidth: 600,
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
                  color="primary"
                  startIcon={<Refresh />}
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
                  Try Again
                </Button>
              )}

              <Button
                href="/"
                size="large"
                variant="outlined"
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

              <Button
                onClick={handleReportBug}
                size="large"
                variant="text"
                color="primary"
                startIcon={<BugReport />}
                sx={{
                  "&:hover": {
                    bgcolor: "action.hover",
                  },
                }}
              >
                Report Bug
              </Button>
            </Stack>

            {/* Suggestions */}
            {suggestions && suggestions.length > 0 && (
              <Box sx={{ width: "100%", mt: 4 }}>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 3,
                    textAlign: "left",
                    bgcolor: "background.paper",
                  }}
                >
                  <Stack spacing={2}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Lightbulb color="primary" />
                      <Typography variant="h6" color="text.primary">
                        Suggested Solutions
                      </Typography>
                    </Box>

                    <Divider />

                    <List dense>
                      {suggestions.map((suggestion) => (
                        <ListItem key={suggestion} sx={{ py: 0.5 }}>
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            <Box
                              sx={{
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                bgcolor: "primary.main",
                              }}
                            />
                          </ListItemIcon>
                          <ListItemText
                            primary={suggestion}
                            primaryTypographyProps={{
                              variant: "body2",
                              color: "text.secondary",
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Stack>
                </Paper>
              </Box>
            )}

            {/* Debug Details (Development Only) */}
            {showDetails && (technicalDetails || errorCode || digest) && (
              <Box sx={{ width: "100%", mt: 4 }}>
                <Accordion
                  sx={{
                    bgcolor: "background.paper",
                    border: 1,
                    borderColor: "divider",
                    "&:before": { display: "none" },
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMore />}
                    sx={{
                      "& .MuiAccordionSummary-content": {
                        alignItems: "center",
                      },
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Technical Details
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Stack spacing={1} alignItems="flex-start">
                      {errorCode && (
                        <Typography variant="caption" sx={{ fontFamily: "monospace" }}>
                          <strong>Error Code:</strong> {errorCode}
                        </Typography>
                      )}
                      {digest && (
                        <Typography variant="caption" sx={{ fontFamily: "monospace" }}>
                          <strong>Digest:</strong> {digest}
                        </Typography>
                      )}
                      {technicalDetails &&
                        Object.entries(technicalDetails).map(([key, value]) => (
                          <Typography key={key} variant="caption" sx={{ fontFamily: "monospace" }}>
                            <strong>{key}:</strong>{" "}
                            {typeof value === "object"
                              ? JSON.stringify(value, null, 2)
                              : String(value)}
                          </Typography>
                        ))}
                      <Typography variant="caption" sx={{ fontFamily: "monospace" }}>
                        <strong>Current Time:</strong> {new Date().toISOString()}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ fontFamily: "monospace", wordBreak: "break-all" }}
                      >
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
              If this problem persists, please contact support with the error details above.
            </Typography>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}
