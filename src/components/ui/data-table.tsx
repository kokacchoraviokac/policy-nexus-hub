
import React from "react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  getSortedRowModel,
  getFilteredRowModel,
  SortingState,
  ColumnDef,
  ColumnFiltersState,
  CellContext
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Pagination from "@/components/ui/pagination";
import TableSkeletonLoader from "@/components/common/TableSkeletonLoader";
import { useLanguage } from "@/contexts/LanguageContext";

export type Column<TData> = ColumnDef<TData, unknown>;

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  pagination?: {
    pageIndex?: number;
    pageSize?: number;
    onPageChange?: (page: number) => void;
    onPageSizeChange?: (pageSize: number) => void;
    pageSizeOptions?: number[];
    totalCount?: number;
    totalPages?: number;
  };
  keyField: string; // Required field for key identification
  emptyState?: {
    title: string;
    description: string;
    action?: React.ReactNode;
  };
  onRowClick?: (row: TData) => void;
  sortable?: boolean;
  rowClassName?: (row: TData) => string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading = false,
  pagination,
  keyField,
  emptyState,
  onRowClick,
  sortable = false,
  rowClassName,
}: DataTableProps<TData, TValue>) {
  const { t } = useLanguage();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      pagination: pagination
        ? {
            pageIndex: pagination.pageIndex || 0,
            pageSize: pagination.pageSize || 10,
          }
        : undefined,
    },
    enableSorting: sortable,
    manualPagination: !!pagination,
  });

  // Handle empty or loading state
  if (isLoading) {
    return <TableSkeletonLoader columns={columns.length} />;
  }

  if (!isLoading && data.length === 0 && emptyState) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <h3 className="text-lg font-medium">{emptyState.title}</h3>
        <p className="text-sm text-muted-foreground mt-1">
          {emptyState.description}
        </p>
        {emptyState.action && (
          <div className="mt-4">{emptyState.action}</div>
        )}
      </div>
    );
  }

  const getRowKey = (row: TData) => {
    // @ts-ignore - We know the keyField exists on TData
    return row[keyField] || `row-${Math.random()}`;
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow
                key={getRowKey(row.original)}
                onClick={() => onRowClick && onRowClick(row.original)}
                className={cn(
                  onRowClick && "cursor-pointer hover:bg-muted",
                  rowClassName && rowClassName(row.original)
                )}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {pagination && pagination.totalPages && pagination.totalPages > 1 && (
        <Pagination
          totalPages={pagination.totalPages}
          currentPage={(pagination.pageIndex || 0) + 1}
          onPageChange={(page) =>
            pagination.onPageChange && pagination.onPageChange(page - 1)
          }
          itemsCount={pagination.totalCount}
          itemsPerPage={pagination.pageSize || 10}
        />
      )}
    </div>
  );
}

// Helper function for conditional class names
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export default DataTable;
