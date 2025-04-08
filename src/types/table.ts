
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
  // For compatibility with our custom components
  currentPage?: number;
  itemsPerPage?: number;
  totalCount?: number;
  totalItems?: number;
  totalPages?: number;
}

export interface SortingState {
  id: string;
  desc: boolean;
}

export interface TableState {
  pagination: Pagination;
  sorting: SortingState[];
}

export interface CellContext<T = any, V = unknown> {
  row: { original: T };
  getValue: () => V;
  // Include direct row data access for compatibility with existing code
  [key: string]: any;
}

export interface ColumnDef<T = any, V = unknown> {
  id?: string;
  accessorKey?: string;
  header?: string | ReactNode;
  cell?: (props: { row: { original: T } }) => ReactNode;
  enableSorting?: boolean;
  meta?: any;
  sortable?: boolean;
}

// Add direct row access mapping helper
export type CellContextWithRowAccess<T> = CellContext<T, unknown> & T;
