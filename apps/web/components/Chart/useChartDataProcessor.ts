import { useMemo } from "react";
import type { TimeFilterOption } from "./ChartTimeFilter";

export type TimeSeriesDataPoint = {
  measured_at: string;
  value: number;
  notes?: string | null;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  [key: string]: any;
};

export type ProcessedChartData = {
  xAxisData: Date[];
  yAxisData: number[];
  chartData: Array<{
    x: Date;
    y: number;
    notes?: string;
  }>;
  stats: {
    latest: number | null;
    oldest: number | null;
    change: number;
    hasData: boolean;
  };
};

export function formatDateByFilter(dateString: string, timeFilter: TimeFilterOption): string {
  const date = new Date(dateString);

  switch (timeFilter) {
    case "1W":
      return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
    case "1M":
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    case "3M":
    case "6M":
    case "1Y":
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    case "All":
      return date.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
    default:
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }
}

export function filterDataByTime<T extends TimeSeriesDataPoint>(
  data: T[],
  timeFilter: TimeFilterOption
): T[] {
  if (timeFilter === "All") return data;

  const now = new Date();
  const filterDate = new Date(now);

  switch (timeFilter) {
    case "1W":
      filterDate.setDate(now.getDate() - 7);
      break;
    case "1M":
      filterDate.setMonth(now.getMonth() - 1);
      break;
    case "3M":
      filterDate.setMonth(now.getMonth() - 3);
      break;
    case "6M":
      filterDate.setMonth(now.getMonth() - 6);
      break;
    case "1Y":
      filterDate.setFullYear(now.getFullYear() - 1);
      break;
    default:
      return data;
  }

  return data.filter((item) => new Date(item.measured_at) >= filterDate);
}

export function useChartDataProcessor<T extends TimeSeriesDataPoint>(
  data: T[],
  timeFilter: TimeFilterOption,
  valueField: keyof T = "value" as keyof T
): ProcessedChartData {
  return useMemo(() => {
    // Sort data by date
    const sortedData = [...data].sort(
      (a, b) => new Date(a.measured_at).getTime() - new Date(b.measured_at).getTime()
    );

    // Apply time filter
    const filteredData = filterDataByTime(sortedData, timeFilter);

    // Process chart data
    const chartData = filteredData.map((item) => ({
      x: new Date(item.measured_at),
      y: Number(item[valueField]),
      notes: item.notes ?? undefined,
    }));

    const xAxisData = chartData.map((d) => d.x);
    const yAxisData = chartData.map((d) => d.y);

    // Calculate stats
    const latest = yAxisData.length > 0 ? yAxisData[yAxisData.length - 1] : null;
    const oldest = yAxisData.length > 0 ? yAxisData[0] : null;
    const change = latest !== null && oldest !== null ? latest - oldest : 0;

    return {
      xAxisData,
      yAxisData,
      chartData,
      stats: {
        latest,
        oldest,
        change,
        hasData: filteredData.length > 0,
      },
    };
  }, [data, timeFilter, valueField]);
}
