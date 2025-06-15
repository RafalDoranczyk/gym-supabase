import { CheckCircle } from "@mui/icons-material";
import { Alert, Avatar, Box, Button, Container, Paper, Typography } from "@mui/material";

type OnboardingErrorProps = {
  error: string;
  onRetry: () => void;
  onSkip: () => void;
};

export function OnboardingError({ error, onRetry, onSkip }: OnboardingErrorProps) {
  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 6, textAlign: "center" }}>
        <Avatar sx={{ bgcolor: "error.main", width: 80, height: 80, mx: "auto", mb: 3 }}>
          <CheckCircle sx={{ fontSize: 48 }} />
        </Avatar>

        <Typography variant="h4" gutterBottom fontWeight="bold" color="error.main">
          Setup Failed
        </Typography>

        <Typography variant="body1" color="text.secondary" mb={4}>
          {error}
        </Typography>

        <Box display="flex" gap={2} justifyContent="center" flexWrap="wrap">
          <Button variant="outlined" onClick={onRetry} size="large">
            Try Again
          </Button>
          <Button variant="contained" onClick={onSkip} size="large">
            Skip Setup
          </Button>
        </Box>

        {/* Development error details */}
        {process.env.NODE_ENV === "development" && (
          <Alert severity="error" sx={{ mt: 3, textAlign: "left" }}>
            <Typography variant="caption">Check console for detailed error information</Typography>
          </Alert>
        )}
      </Paper>
    </Container>
  );
}
