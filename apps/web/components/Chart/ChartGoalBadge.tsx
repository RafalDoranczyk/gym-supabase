import { Box, Typography } from "@mui/material";

export type GoalBadgeProps = {
  /**
   * Current value
   */
  currentValue: number;

  /**
   * Goal target value
   */
  goalValue: number;

  /**
   * Goal label/name
   * @default "Goal"
   */
  goalLabel?: string;

  /**
   * Unit to display
   * @default ""
   */
  unit?: string;

  /**
   * Goal direction - whether lower values are better
   * @default "lower" (like weight loss)
   */
  direction?: "lower" | "higher";

  /**
   * Number of decimal places to show
   * @default 1
   */
  precision?: number;

  /**
   * Badge size
   * @default "small"
   */
  size?: "small" | "medium" | "large";

  /**
   * Custom colors
   */
  colors?: {
    achieved: string;
    inProgress: string;
  };
};

const defaultColors = {
  achieved: "#4ade80",
  inProgress: "#fbbf24",
};

const getSizeConfig = (size: "small" | "medium" | "large") => {
  switch (size) {
    case "small":
      return {
        dotSize: 6,
        padding: "4px 8px",
        fontSize: "10px",
      };
    case "medium":
      return {
        dotSize: 8,
        padding: "6px 12px",
        fontSize: "12px",
      };
    case "large":
      return {
        dotSize: 10,
        padding: "8px 16px",
        fontSize: "14px",
      };
  }
};

export function ChartGoalBadge({
  currentValue,
  goalValue,
  goalLabel = "Goal",
  unit = "",
  direction = "lower",
  precision = 1,
  size = "small",
  colors = defaultColors,
}: GoalBadgeProps) {
  const isGoalReached =
    direction === "lower" ? currentValue <= goalValue : currentValue >= goalValue;

  const distanceToGoal = Math.abs(currentValue - goalValue);
  const color = isGoalReached ? colors.achieved : colors.inProgress;
  const sizeConfig = getSizeConfig(size);

  return (
    <Box
      display="flex"
      alignItems="center"
      gap={1}
      sx={{
        backgroundColor: `${color}1A`, // 10% opacity
        border: `1px solid ${color}`,
        borderRadius: "6px",
        padding: sizeConfig.padding,
      }}
    >
      <Box
        sx={{
          width: sizeConfig.dotSize,
          height: sizeConfig.dotSize,
          borderRadius: "50%",
          backgroundColor: color,
        }}
      />
      <Typography
        variant="caption"
        sx={{
          color,
          fontWeight: 600,
          fontSize: sizeConfig.fontSize,
        }}
      >
        {goalLabel}: {goalValue.toFixed(precision)}
        {unit}
        {!isGoalReached && (
          <>
            {" "}
            ({distanceToGoal.toFixed(precision)}
            {unit} to go)
          </>
        )}
        {isGoalReached && " ✓"}
      </Typography>
    </Box>
  );
}
