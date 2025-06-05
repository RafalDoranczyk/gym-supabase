import { TableCell, TableHead, TableRow, TableSortLabel } from "@mui/material";

import type { TableData, TableOrder } from "../../hooks";

export type NutritionTableHeadCell = {
  id: string;
  label: string;
  numeric: boolean;
  width: number;
};

type NutritionTableHeadProps = {
  headCells: NutritionTableHeadCell[];
  onRequestSort: (event: React.MouseEvent<unknown>, property: string) => void;
  order?: TableOrder;
  orderBy?: keyof TableData;
};

export function NutritionTableHead({
  headCells,
  onRequestSort,
  order,
  orderBy,
}: NutritionTableHeadProps) {
  return (
    <TableHead>
      <TableRow>
        {headCells.map(({ id, label, numeric, width }) => (
          <TableCell
            align={numeric ? "right" : "left"}
            key={id}
            sortDirection={orderBy === id ? order : false}
            sx={{
              background: ({ palette }) => palette.background.paper,
              width,
            }}
          >
            <TableSortLabel
              active={orderBy === id}
              direction={orderBy === id ? order : "asc"}
              onClick={(e) => onRequestSort(e, id)}
            >
              {label}
            </TableSortLabel>
          </TableCell>
        ))}
        <TableCell
          sx={{
            background: ({ palette }) => palette.background.paper,
            width: 60,
          }}
        />
      </TableRow>
    </TableHead>
  );
}
