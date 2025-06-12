import {
  NutritionCard,
  NutritionCardSkeleton,
  WeekNavigation,
  type NutritionData,
} from "@/components";
import { PATHS } from "@/constants";
import { Box, Button, Grid, Stack, Typography } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import type { TransitionStartFunction } from "react";

const nutritionTypes: (keyof NutritionData)[] = ["calories", "protein", "carbs", "fat"];

type FoodDiarySidebarProps = {
  selectedDate: string;
  nutrition: NutritionData;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  dailyGoals: any;
  hasPendingChanges: boolean;
  isPending: boolean;
  onSaveChanges: () => void;
  startTransition: TransitionStartFunction;
};

export function FoodDiarySidebar({
  selectedDate,
  nutrition,
  dailyGoals,
  hasPendingChanges,
  isPending,
  onSaveChanges,
  startTransition,
}: FoodDiarySidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const onDateChange = (date: string) => {
    startTransition(async () => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("date", date);
      router.push(`${PATHS.NUTRITION.FOOD_DIARY}?${params.toString()}`);
    });
  };

  return (
    <Stack spacing={3}>
      {/* Week Navigation */}
      <Box p={2} borderRadius={2} bgcolor="background.paper">
        <WeekNavigation selectedDate={selectedDate} onDateChange={onDateChange} />
      </Box>

      {/* Nutrition Cards */}
      <Grid container spacing={2}>
        {nutritionTypes.map((type) => (
          <Grid key={type} size={{ xs: 6 }}>
            {isPending ? (
              <NutritionCardSkeleton />
            ) : (
              <NutritionCard
                type={type}
                consumed={nutrition[type]}
                goal={dailyGoals[type]}
                showRemaining
              />
            )}
          </Grid>
        ))}
      </Grid>

      {/* Save Changes Banner */}
      {hasPendingChanges && (
        <Box
          p={2.5}
          borderRadius={2}
          bgcolor="primary.main"
          color="white"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          gap={2}
        >
          <Box>
            <Typography variant="subtitle1" fontWeight="bold" mb={0.5}>
              Changes ready to save
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.9 }}>
              Save your meals to track your nutrition progress
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="warning"
            onClick={onSaveChanges}
            loading={isPending}
            sx={{ minWidth: "120px", whiteSpace: "nowrap" }}
          >
            Save changes
          </Button>
        </Box>
      )}
    </Stack>
  );
}
