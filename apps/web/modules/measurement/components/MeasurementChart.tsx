"use client";

import {
  Chart,
  formatDateByFilter,
  useChartDataProcessor,
  type TimeFilterOption,
} from "@/components";
import { Analytics, ShowChart, TrendingDown, TrendingUp } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import { useState } from "react";
import type { Measurement } from "../schemas";

const MEASUREMENT_CHART_HEIGHT = 490;
const MEASUREMENTS_MIN_TO_SHOW_CHART = 3;
const WEIGHT_MEASUREMENT_TYPE_ID = "weight";
const DEFAULT_GOAL_WEIGHT = 70;

type BaseChartProps = {
  timeFilter: TimeFilterOption;
  onFilterChange: (filter: TimeFilterOption) => void;
};

type ChartStats = {
  latest?: number | null;
  change: number;
  hasData: boolean;
};

type MeasurementChartProps = {
  measurements: Measurement[];
  onAddMeasurement: () => void;
  goalWeight?: number;
};

function getTickNumber(timeFilter: TimeFilterOption): number {
  switch (timeFilter) {
    case "1W":
      return 4;
    case "1M":
      return 6;
    default:
      return 8;
  }
}

function ChartHeader({ timeFilter, onFilterChange }: BaseChartProps) {
  return (
    <Chart.Header
      title="Weight Progress Chart"
      icon={<ShowChart />}
      actions={<Chart.TimeFilter activeFilter={timeFilter} onFilterChange={onFilterChange} />}
    />
  );
}

function ChartStats({ stats }: { stats: Pick<ChartStats, "change"> }) {
  return (
    <Chart.Stats
      leftContent={
        <Chart.InfoText
          icon={<Analytics sx={{ color: (theme) => theme.palette.grey[300] }} />}
          text="Hover over data points to see detailed information and notes"
        />
      }
      rightContent={
        stats.change !== 0 && (
          <Typography
            display="flex"
            alignItems="center"
            gap={1}
            variant="caption"
            fontWeight={600}
            sx={{
              color: (theme) =>
                stats.change > 0 ? theme.palette.error.dark : theme.palette.success.dark,
            }}
          >
            {stats.change > 0 ? <TrendingUp /> : <TrendingDown />}
            {Math.abs(stats.change).toFixed(1)}kg overall change
          </Typography>
        )
      }
    />
  );
}

function EmptyDataState({ onAddMeasurement }: { onAddMeasurement: () => void }) {
  return (
    <Chart.Layout>
      <Chart.Header title="Weight Progress Chart" icon={<ShowChart />} />

      <Box
        flexGrow={1}
        display="flex"
        alignItems="center"
        justifyContent="center"
        minHeight={MEASUREMENT_CHART_HEIGHT}
      >
        <Chart.EmptyState
          title="Need More Data Points"
          description="Add at least 3 measurements to see your progress chart"
          buttonText="Add First Measurements"
          onAction={onAddMeasurement}
          minDataPoints={3}
        />
      </Box>

      <Box minHeight={60} />
    </Chart.Layout>
  );
}

function NoDataForFilterState({
  timeFilter,
  onFilterChange,
  onAddMeasurement,
}: BaseChartProps & { onAddMeasurement: () => void }) {
  return (
    <Chart.Layout>
      <ChartHeader timeFilter={timeFilter} onFilterChange={onFilterChange} />

      <Box
        flexGrow={1}
        display="flex"
        alignItems="center"
        justifyContent="center"
        minHeight={MEASUREMENT_CHART_HEIGHT}
      >
        <Chart.NoDataState
          timeFilter={timeFilter}
          onFilterChange={onFilterChange}
          onAddData={onAddMeasurement}
          dataType="weight measurements"
          addButtonText="Add Measurement"
        />
      </Box>

      <Box minHeight={80} />
    </Chart.Layout>
  );
}

function ChartWithData({
  timeFilter,
  onFilterChange,
  xAxisData,
  yAxisData,
  stats,
  goalWeight,
}: BaseChartProps & {
  xAxisData: Date[];
  yAxisData: number[];
  stats: ChartStats;
  goalWeight: number;
}) {
  return (
    <Chart.Layout>
      <ChartHeader timeFilter={timeFilter} onFilterChange={onFilterChange} />

      <Box flexGrow={1}>
        <Chart.Container height={MEASUREMENT_CHART_HEIGHT}>
          <Box width="100%">
            <Box m={2} display="flex" justifyContent="flex-end">
              <Chart.GoalBadge
                currentValue={stats.latest || 0}
                goalValue={goalWeight}
                unit="kg"
                direction="lower"
                size="medium"
              />
            </Box>

            <Chart.LineChart
              height={MEASUREMENT_CHART_HEIGHT * 0.9}
              series={[{ data: yAxisData, label: "Weight" }]}
              xAxis={[
                {
                  data: xAxisData,
                  scaleType: "time",
                  valueFormatter: (value) => formatDateByFilter(value.toISOString(), timeFilter),
                  tickNumber: getTickNumber(timeFilter),
                  domainLimit: "strict",
                },
              ]}
              yAxis={[{ label: "Weight (kg)" }]}
            />
          </Box>
        </Chart.Container>
      </Box>

      <ChartStats stats={stats} />
    </Chart.Layout>
  );
}

export function MeasurementChart({
  measurements,
  onAddMeasurement,
  goalWeight = DEFAULT_GOAL_WEIGHT,
}: MeasurementChartProps) {
  const [timeFilter, setTimeFilter] = useState<TimeFilterOption>("1M");

  // Filter for weight measurements only
  const weightMeasurements = measurements.filter(
    (m) => m.measurement_type_id === WEIGHT_MEASUREMENT_TYPE_ID
  );

  // Process data using the hook
  const { xAxisData, yAxisData, stats } = useChartDataProcessor<Measurement>(
    weightMeasurements,
    timeFilter
  );

  const hasMinimumMeasurements = measurements.length >= MEASUREMENTS_MIN_TO_SHOW_CHART;
  const hasDataForChart = stats.hasData;

  if (!hasMinimumMeasurements) {
    return <EmptyDataState onAddMeasurement={onAddMeasurement} />;
  }

  if (!hasDataForChart) {
    return (
      <NoDataForFilterState
        timeFilter={timeFilter}
        onFilterChange={setTimeFilter}
        onAddMeasurement={onAddMeasurement}
      />
    );
  }

  return (
    <ChartWithData
      timeFilter={timeFilter}
      onFilterChange={setTimeFilter}
      xAxisData={xAxisData}
      yAxisData={yAxisData}
      stats={stats}
      goalWeight={goalWeight}
    />
  );
}
