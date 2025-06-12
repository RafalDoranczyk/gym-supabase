"use client";

import { ChevronLeftRounded, ChevronRightRounded } from "@mui/icons-material";
import { Box, Button, Chip, IconButton, Paper, Stack, Typography } from "@mui/material";
import dayjs, { type Dayjs } from "dayjs";
import { useEffect, useRef, useState } from "react";

export type WeekNavigationProps = {
  selectedDate: string; // YYYY-MM-DD format
  onDateChange: (date: string) => void;
  renderDay?: (day: {
    date: Dayjs;
    isSelected: boolean;
    isToday: boolean;
  }) => React.ReactNode;
};

const DefaultDayButton = ({
  date,
  isSelected,
  isToday,
  onClick,
}: {
  date: Dayjs;
  isSelected: boolean;
  isToday: boolean;
  onClick: () => void;
}) => {
  return (
    <Button
      onClick={onClick}
      variant={isSelected ? "contained" : "outlined"}
      color={isSelected ? "primary" : "inherit"}
      sx={{
        minWidth: 0,
        height: 80,
        flexDirection: "column",
        textTransform: "none",
        position: "relative",
        borderColor: "divider",
        ...(isSelected && {
          background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #c084fc 100%)",
          borderColor: "transparent",
          color: "white",
          "&:hover": {
            background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #c084fc 100%)",
          },
        }),
      }}
    >
      <Typography
        variant="caption"
        color={isSelected ? "inherit" : "text.secondary"}
        fontSize="0.7rem"
        fontWeight={600}
        textTransform="uppercase"
      >
        {date.format("ddd")}
      </Typography>
      <Typography
        variant="h6"
        color={isSelected ? "inherit" : "text.primary"}
        fontSize="1.2rem"
        fontWeight={700}
      >
        {date.format("D")}
      </Typography>

      {isToday && (
        <Chip
          label="Today"
          size="small"
          color="warning"
          sx={{
            position: "absolute",
            top: -6,
            right: -6,
            height: 18,
            fontSize: "0.6rem",
            fontWeight: 700,
          }}
        />
      )}
    </Button>
  );
};

export function WeekNavigation({ selectedDate, onDateChange, renderDay }: WeekNavigationProps) {
  const currentDate = dayjs(selectedDate);
  const today = dayjs();
  const isNavigatingRef = useRef(false);

  // Start week so today is the last day (rightmost)
  const [weekStart, setWeekStart] = useState(() => {
    return today.subtract(6, "day");
  });

  // Auto-adjust week view when selectedDate changes to a date outside current week
  // BUT only if we're not currently navigating manually
  useEffect(() => {
    if (isNavigatingRef.current) {
      isNavigatingRef.current = false;
      return;
    }

    const weekEnd = weekStart.add(6, "day");
    const isSelectedDateInCurrentWeek =
      (currentDate.isAfter(weekStart, "day") || currentDate.isSame(weekStart, "day")) &&
      (currentDate.isBefore(weekEnd, "day") || currentDate.isSame(weekEnd, "day"));

    if (!isSelectedDateInCurrentWeek) {
      // Calculate new week start so selected date is visible
      // Put selected date as the last day of the week (like today was initially)
      const newWeekStart = currentDate.subtract(6, "day");
      setWeekStart(newWeekStart);
    }
  }, [weekStart, currentDate]);

  // Generate 7 days starting from weekStart
  const days = Array.from({ length: 7 }, (_, i) => weekStart.add(i, "day"));

  const goToPreviousWeek = () => {
    isNavigatingRef.current = true;
    setWeekStart((prev) => prev.subtract(7, "day"));
  };

  const goToNextWeek = () => {
    isNavigatingRef.current = true;
    setWeekStart((prev) => prev.add(7, "day"));
  };

  const goToToday = () => {
    isNavigatingRef.current = true;
    const todayAsLastDay = today.subtract(6, "day");
    setWeekStart(todayAsLastDay);
    onDateChange(today.format("YYYY-MM-DD"));
  };

  const handleDayClick = (date: Dayjs) => {
    onDateChange(date.format("YYYY-MM-DD"));
  };

  // Check if current week contains today
  const weekEnd = weekStart.add(6, "day");
  const currentWeekContainsToday =
    (today.isAfter(weekStart, "day") || today.isSame(weekStart, "day")) &&
    (today.isBefore(weekEnd, "day") || today.isSame(weekEnd, "day"));

  // Format week range
  const formatWeekRange = () => {
    const start = weekStart.format("MMM D");
    const end = weekEnd.format("MMM D, YYYY");
    return `${start} – ${end}`;
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 3 }}>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <IconButton onClick={goToPreviousWeek} color="primary">
          <ChevronLeftRounded />
        </IconButton>

        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography variant="h6" fontWeight={600}>
            {formatWeekRange()}
          </Typography>

          {!currentWeekContainsToday && (
            <Chip label="Go to Today" onClick={goToToday} clickable color="warning" size="small" />
          )}
        </Stack>

        <IconButton onClick={goToNextWeek} color="primary">
          <ChevronRightRounded />
        </IconButton>
      </Stack>

      {/* Days Grid */}
      <Box display="grid" gridTemplateColumns="repeat(7, 1fr)" gap={1}>
        {days.map((date) => {
          const isSelected = date.isSame(currentDate, "day");
          const isToday = date.isSame(today, "day");

          const dayProps = { date, isSelected, isToday };

          if (renderDay) {
            return (
              <Box key={date.format("YYYY-MM-DD")} onClick={() => handleDayClick(date)}>
                {renderDay(dayProps)}
              </Box>
            );
          }

          return (
            <DefaultDayButton
              key={date.format("YYYY-MM-DD")}
              date={date}
              isSelected={isSelected}
              isToday={isToday}
              onClick={() => handleDayClick(date)}
            />
          );
        })}
      </Box>
    </Paper>
  );
}
