import {
  Box,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

const ROW_NUMBER = 10;

type TableSkeletonProps = {
  rowNumber?: number;
  columnCount?: number;
  showFilters?: boolean;
};

export function TableSkeleton({
  rowNumber = ROW_NUMBER,
  columnCount = 8,
  showFilters = true,
}: TableSkeletonProps) {
  return (
    <Box>
      {/* Filters Skeleton */}
      {showFilters && (
        <Box display="flex" alignItems="center" mb={3} gap={2}>
          <Skeleton variant="rounded" width={60} height={36} sx={{ borderRadius: 1 }} />
          <Skeleton variant="rounded" width={30} height={36} sx={{ borderRadius: 1 }} />
          <Skeleton variant="rounded" height={36} sx={{ borderRadius: 1, flexGrow: 1 }} />
          <Skeleton variant="rounded" width={140} height={36} sx={{ borderRadius: 1 }} />
        </Box>
      )}

      {/* Table Skeleton */}
      <TableContainer component={Paper} sx={{ bgcolor: "background.paper" }}>
        <Table>
          {/* Table Head Skeleton */}
          <TableHead>
            <TableRow>
              {Array.from({ length: columnCount }, (_, i) => (
                <TableCell
                  // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                  key={i}
                  sx={{
                    minWidth: i === 0 ? 140 : 90,
                  }}
                >
                  <Skeleton variant="text" width={80} height={20} />
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          {/* Table Body Skeleton */}
          <TableBody>
            {Array.from({ length: rowNumber }, (_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              <TableRow key={i}>
                {Array.from({ length: columnCount }, (_, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                  <TableCell key={i}>
                    <Skeleton variant="rounded" height={20} sx={{ borderRadius: 1 }} />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination Skeleton */}
      <Box display="flex" justifyContent="flex-end" alignItems="center" mt={2} px={2}>
        <Skeleton variant="text" width={110} height={24} sx={{ mr: 2 }} />
        <Skeleton variant="text" width={80} height={24} sx={{ mr: 2 }} />
        <Skeleton variant="circular" width={32} height={32} sx={{ mr: 1 }} />
        <Skeleton variant="circular" width={32} height={32} />
      </Box>
    </Box>
  );
}
