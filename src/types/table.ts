
import { ReactNode } from "react";

export interface Column<T = any> {
  key: string;
  id?: string;
  accessorKey?: string;
  header: string | ReactNode;
  cell?: (row: T) => ReactNode;
  render?: (row: T) => ReactNode;
  enableSorting?: boolean;
  sortable?: boolean;
  meta?: any;
  className?: string;
}

export interface Pagination {
  pageIndex: number;
  pageSize: number;
}

export interface SortingState {
  id: string;
  desc: boolean;
}

export interface TableState {
  pagination: Pagination;
  sorting: SortingState[];
}

export interface CellContext<T, V> {
  row: T;
  getValue: () => V;
  [key: string]: any;
}

export interface ColumnDef<T, V = unknown> {
  id?: string;
  accessorKey?: string;
  header?: string | ReactNode;
  cell?: (props: { row: T }) => ReactNode;
  enableSorting?: boolean;
  meta?: any;
  sortable?: boolean;
}
