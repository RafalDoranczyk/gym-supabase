import { Table, TableContainer, type TableContainerOwnProps } from "@mui/material";
import type { PropsWithChildren } from "react";

import { NutritionTableHead } from "./NutritionTableHead";
import { NutritionTableSkeleton } from "./NutritionTableSkeleton";

function Root({ children, ...props }: PropsWithChildren<TableContainerOwnProps>) {
  return (
    <TableContainer
      sx={{
        "::-webkit-scrollbar": {
          width: "10px",
        },
        "::-webkit-scrollbar-thumb": {
          background: ({ palette }) => palette.primary.dark,
        },
        "::-webkit-scrollbar-thumb:hover": {
          background: (theme) => theme.palette.primary.main,
        },
        "::-webkit-scrollbar-track": {
          background: ({ palette }) => palette.primary.light,
        },
        ...props.sx,
      }}
    >
      <Table
        aria-labelledby="nutrition table"
        stickyHeader
        sx={{
          minWidth: 750,
          tableLayout: "fixed",
        }}
      >
        {children}
      </Table>
    </TableContainer>
  );
}

export const NutritionTable = {
  Head: NutritionTableHead,
  Root,
  Skeleton: NutritionTableSkeleton,
};
