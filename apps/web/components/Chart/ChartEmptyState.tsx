import { Add, Timeline } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import type { ReactNode } from "react";

export interface ChartEmptyStateProps {
  /**
   * Title displayed in the empty state
   * @default "Need More Data Points"
   */
  title?: string;

  /**
   * Description text below the title
   * @default "Add some data to see your chart visualization"
   */
  description?: string;

  /**
   * Button text
   * @default "Add Data"
   */
  buttonText?: string;

  /**
   * Icon to display (defaults to Timeline)
   */
  icon?: ReactNode;

  /**
   * Callback when action button is clicked
   */
  onAction?: () => void;

  /**
   * Show the action button
   * @default true
   */
  showButton?: boolean;

  /**
   * Custom button icon (defaults to Add)
   */
  buttonIcon?: ReactNode;

  /**
   * Minimum data points required (used in default description)
   * @default 3
   */
  minDataPoints?: number;
}

export function ChartEmptyState({
  title = "Need More Data Points",
  description,
  buttonText = "Add Data",
  icon = <Timeline />,
  onAction,
  showButton = true,
  buttonIcon = <Add />,
  minDataPoints = 3,
}: ChartEmptyStateProps) {
  const defaultDescription = `Add at least ${minDataPoints} data points to see your chart visualization`;

  return (
    <Box textAlign="center" py={8} color="#666">
      <Box
        component="div"
        sx={{
          fontSize: 48,
          mb: 2,
          opacity: 0.5,
          color: "#888",
          "& svg": {
            fontSize: "inherit",
          },
        }}
      >
        {icon}
      </Box>

      <Typography variant="h6" mb={1} fontWeight={600} color="white">
        {title}
      </Typography>

      <Typography variant="body2" mb={3} fontSize="0.875rem">
        {description || defaultDescription}
      </Typography>

      {showButton && onAction && (
        <Button
          variant="contained"
          onClick={onAction}
          startIcon={buttonIcon}
          sx={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            borderRadius: 2,
            px: 3,
            py: 1,
            fontWeight: 500,
            textTransform: "none",
            fontSize: "0.875rem",
            "&:hover": {
              background: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
              transform: "translateY(-1px)",
            },
            transition: "all 0.2s ease",
          }}
        >
          {buttonText}
        </Button>
      )}
    </Box>
  );
}
