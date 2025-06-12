import {
  Table as MuiTable,
  TableBody as MuiTableBody,
  TableCell as MuiTableCell,
  TableHead as MuiTableHead,
  TablePagination as MuiTablePagination,
  TableRow as MuiTableRow,
  TableContainer,
  TableSortLabel,
  type TableBodyProps,
  type TableCellProps,
  type TableContainerOwnProps,
  type TableRowProps,
} from "@mui/material";
import type { PropsWithChildren } from "react";
import { TableSkeleton } from "./TableSkeleton";

export type TableOrder = "asc" | "desc";

export type TableHeadCell = {
  id: string;
  label: string;
  numeric: boolean;
  width: number;
  sortable?: boolean;
};

type TableHeadProps = {
  headCells: TableHeadCell[];
  onRequestSort: (event: React.MouseEvent<unknown>, property: string) => void;
  order?: TableOrder;
  orderBy?: string;
};

type TablePaginationProps = {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  rowsPerPageOptions?: number[];
};

function TableRoot({ children, ...props }: PropsWithChildren<TableContainerOwnProps>) {
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
      <MuiTable
        aria-labelledby="table"
        stickyHeader
        sx={{
          minWidth: 750,
          tableLayout: "fixed",
        }}
      >
        {children}
      </MuiTable>
    </TableContainer>
  );
}

function TableHead({ headCells, onRequestSort, order, orderBy }: TableHeadProps) {
  return (
    <MuiTableHead>
      <MuiTableRow>
        {headCells.map(({ id, label, numeric, width, sortable = false }) => (
          <MuiTableCell
            align={numeric ? "right" : "left"}
            key={id}
            sortDirection={orderBy === id ? order : false}
            sx={{
              background: ({ palette }) => palette.background.paper,
              width,
            }}
          >
            <TableSortLabel
              disabled={!sortable}
              active={orderBy === id}
              direction={orderBy === id ? order : "asc"}
              onClick={(e) => onRequestSort(e, id)}
            >
              {label}
            </TableSortLabel>
          </MuiTableCell>
        ))}
        <MuiTableCell
          sx={{
            background: ({ palette }) => palette.background.paper,
            width: 60,
          }}
        />
      </MuiTableRow>
    </MuiTableHead>
  );
}

function TableBody({ children, ...props }: TableBodyProps) {
  return <MuiTableBody {...props}>{children}</MuiTableBody>;
}

function TableRow({ children, ...props }: TableRowProps) {
  return <MuiTableRow {...props}>{children}</MuiTableRow>;
}

function TableCell({ children, ...props }: TableCellProps) {
  return <MuiTableCell {...props}>{children}</MuiTableCell>;
}

function ZebraRow({ children, ...props }: TableRowProps) {
  return (
    <Table.Row
      sx={{
        "&:nth-of-type(even)": {
          backgroundColor: "rgba(255, 255, 255, 0.02)",
        },
        "&:hover": {
          backgroundColor: "action.hover !important",
        },
        "&:hover .delete-button-cell": {
          opacity: 1,
          visibility: "visible",
        },
        "&:hover svg.MuiSvgIcon-root": {
          opacity: 1,
        },
        cursor: "pointer",
        ...props.sx,
      }}
      {...props}
    >
      {children}
    </Table.Row>
  );
}

function TablePagination({
  count,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPageOptions = [5, 10, 25, 50],
}: TablePaginationProps) {
  return (
    <MuiTablePagination
      count={count}
      component="div"
      page={page}
      rowsPerPage={rowsPerPage}
      rowsPerPageOptions={rowsPerPageOptions}
      showFirstButton
      showLastButton
      onPageChange={onPageChange}
      onRowsPerPageChange={onRowsPerPageChange}
    />
  );
}

export const Table = {
  Root: TableRoot,
  Head: TableHead,
  Body: TableBody,
  Row: TableRow,
  Cell: TableCell,
  ZebraRow: ZebraRow,
  Pagination: TablePagination,
  Skeleton: TableSkeleton,
};
