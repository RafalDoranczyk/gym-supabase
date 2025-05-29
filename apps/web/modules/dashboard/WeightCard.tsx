"use client";

import { Elevation } from "@/components";
import { Chip, Stack, Typography } from "@mui/material";
import { ChartContainer } from "@mui/x-charts/ChartContainer";
import { LinePlot } from "@mui/x-charts/LineChart";
import type { Measurements } from "@repo/schemas";
import { useMemo } from "react";

import { DashboardCard } from "./styles";

type WeightCardProps = {
  data: Measurements[];
};

export function WeightCard({ data }: WeightCardProps) {
  const dataset = useMemo(
    () =>
      data
        .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
        .map((item) => ({
          x: new Date(item.created_at),
          y: item.weight,
        })),
    [data],
  );

  return (
    <Elevation>
      <Stack spacing={1}>
        <Typography variant="body1">Weight</Typography>

        <Stack alignItems="center" direction="row">
          <Typography variant="h5">
            {dataset[dataset.length - 1].y} <span>kg</span>
          </Typography>
          <Chip
            color="primary"
            label="-1,5kg"
            size="small"
            sx={{
              ml: "auto",
            }}
          />
        </Stack>

        <Typography variant="caption">Last 30 days</Typography>
      </Stack>
      <div>
        <ChartContainer
          dataset={dataset}
          height={400}
          series={[
            {
              dataKey: "y",
              label: "Waga (kg)",
              showMark: true,
              type: "line",
            },
          ]}
          width={400}
          xAxis={[
            {
              dataKey: "x",
              label: "Data",
              scaleType: "time",
              valueFormatter: (date) => new Date(date).toLocaleDateString(),
            },
          ]}
          // yAxis={[
          //   {
          //     label: 'Waga (kg)',
          //   },
          // ]}
        >
          <LinePlot />
          {/* <ChartsXAxis /> */}
          {/* <ChartsYAxis /> */}
        </ChartContainer>
      </div>
    </Elevation>
  );
}
