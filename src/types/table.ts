
import { ReactNode } from "react";

export interface Column<T = any> {
  id?: string;
  key?: string;
  accessorKey?: string;
  header?: string | ReactNode;
  cell?: (props: { row: any }) => ReactNode;
  enableSorting?: boolean;
  meta?: any;
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
