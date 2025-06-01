import { useState } from "react";

export type TableData = {
  [key: string]: unknown;
  id: number;
  name: string;
};

export type TableOrder = "asc" | "desc";

type Comparable = string | number | Date;

type OrderByKeys<T> = {
  [K in keyof T]: T[K] extends Comparable ? K : never;
}[keyof T];

export function useTableSort<T extends TableData>(data: T[]) {
  const [order, setOrder] = useState<TableOrder>("asc");
  const [orderBy, setOrderBy] = useState<OrderByKeys<T>>("name" as OrderByKeys<T>);
  const [selected, setSelected] = useState<number[]>([]);

  const handleRequestSort = (e: React.MouseEvent<unknown>, property: OrderByKeys<T>) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectElementClick = (selected: number[], id: number) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: number[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleSelectAllClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const newSelecteds = data.map((el) => el.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const actions = {
    handleRequestSort,
    handleSelectAllClick,
    handleSelectElementClick,
    setSelected,
    stableSort: (elements: T[]) => stableSort(elements, getComparator(order, orderBy)),
  };

  return {
    actions,
    order,
    orderBy,
    selected,
  };
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  const aValue = a[orderBy] as unknown as Comparable;
  const bValue = b[orderBy] as unknown as Comparable;

  if (bValue < aValue) {
    return -1;
  }
  if (bValue > aValue) {
    return 1;
  }
  return 0;
}

function getComparator<T>(order: TableOrder, orderBy: keyof T): (a: T, b: T) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = [...array].map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}
