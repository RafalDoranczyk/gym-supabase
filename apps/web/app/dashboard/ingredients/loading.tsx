"use client";

import { PageHeaderSkeleton } from "@/components";
import {
  Box,
  Paper,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

const ROW_COUNT = 10;
const COL_COUNT = 8;

export default function Loading() {
  return (
    <div>
      <PageHeaderSkeleton hasAction />
      {/* Filters and Search */}
      <Stack alignItems="center" direction="row" mb={3} spacing={2}>
        <Skeleton height={36} sx={{ borderRadius: 1 }} variant="rounded" width={60} />
        <Skeleton height={36} sx={{ borderRadius: 1 }} variant="rounded" width={30} />
        <Skeleton height={36} sx={{ borderRadius: 1, flexGrow: 1 }} variant="rounded" />
        <Skeleton height={36} sx={{ borderRadius: 1 }} variant="rounded" width={140} />
      </Stack>

      {/* Table */}
      <TableContainer component={Paper} sx={{ bgcolor: "background.paper" }}>
        <Table>
          <TableHead>
            <TableRow>
              {[
                "Name",
                "Unit Type",
                "Calories",
                "Carbs (g)",
                "Protein (g)",
                "Fat (g)",
                "Price",
                "",
              ].map((header, i) => (
                <TableCell key={header} sx={{ minWidth: i === 0 ? 140 : 90 }}>
                  <Typography sx={{ color: "text.secondary" }} variant="subtitle2">
                    {header}
                  </Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.from({ length: ROW_COUNT }, (_, i) => i).map((rowKey) => (
              <TableRow key={rowKey}>
                {Array.from({ length: COL_COUNT }, (_, j) => j).map((colKey) => (
                  <TableCell key={colKey}>
                    <Skeleton height={20} sx={{ borderRadius: 1 }} variant="rounded" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination Skeleton */}
      <Box alignItems="center" display="flex" justifyContent="flex-end" mt={2} px={2}>
        <Skeleton height={24} sx={{ mr: 2 }} variant="text" width={110} /> {/* Rows per page */}
        <Skeleton height={24} sx={{ mr: 2 }} variant="text" width={80} />
        <Skeleton height={32} sx={{ mr: 1 }} variant="circular" width={32} />
        <Skeleton height={32} variant="circular" width={32} />
      </Box>
    </div>
  );
}
