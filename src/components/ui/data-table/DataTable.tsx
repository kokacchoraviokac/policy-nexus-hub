
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useLanguage } from "@/contexts/LanguageContext";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { PaginationController } from "@/components/ui/pagination-controller";
import { AlertCircle, Database } from "lucide-react";

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
  accessorKey?: string;
  cell?: (row: T) => React.ReactNode;
  sortable?: boolean;
}

export interface DataTableProps<T, K = unknown> {
  data: T[];
  columns: Column<T>[];
  keyField: keyof T;
  isLoading?: boolean;
  error?: Error | null | string;
  onRefresh?: () => void;
  searchPlaceholder?: string;
  emptyState?: {
    title: string;
    description: string;
    action?: React.ReactNode;
  };
  pagination?: {
    pageIndex?: number;
    pageSize?: number;
    onPageChange?: (page: number) => void;
    onPageSizeChange?: (pageSize: number) => void;
    pageSizeOptions?: number[];
    totalCount?: number;
    totalPages?: number;
    totalItems?: number; // For backward compatibility
  };
}

function DataTable<T>({
  data,
  columns,
  keyField,
  isLoading = false,
  error,
  onRefresh,
  emptyState,
  pagination,
}: DataTableProps<T>) {
  const { t } = useLanguage();

  const renderLoadingSkeleton = () => (
    <TableRow>
      <TableCell colSpan={columns.length} className="h-24">
        <div className="flex flex-col items-center justify-center">
          <Skeleton className="h-8 w-8 rounded-full mb-2" />
          <Skeleton className="h-4 w-24" />
        </div>
      </TableCell>
    </TableRow>
  );

  const renderError = () => (
    <TableRow>
      <TableCell colSpan={columns.length} className="h-24">
        <div className="flex flex-col items-center justify-center text-center">
          <AlertCircle className="h-8 w-8 text-destructive mb-2" />
          <p className="text-base font-medium">{t("dataLoadError")}</p>
          <p className="text-sm text-muted-foreground mt-1">
            {typeof error === "string" ? error : error?.message || t("unknownError")}
          </p>
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm"
            >
              {t("tryAgain")}
            </button>
          )}
        </div>
      </TableCell>
    </TableRow>
  );

  const renderEmptyState = () => (
    <TableRow>
      <TableCell colSpan={columns.length} className="h-24">
        <div className="flex flex-col items-center justify-center text-center">
          <Database className="h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-base font-medium">
            {emptyState?.title || t("noData")}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {emptyState?.description || t("noDataDescription")}
          </p>
          {emptyState?.action && (
            <div className="mt-4">{emptyState.action}</div>
          )}
        </div>
      </TableCell>
    </TableRow>
  );

  return (
    <div className="rounded-md border">
      <div className="relative w-full overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHeader
                  key={column.key}
                  className={cn(column.className)}
                >
                  {column.header}
                </TableHeader>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              renderLoadingSkeleton()
            ) : error ? (
              renderError()
            ) : data.length === 0 ? (
              renderEmptyState()
            ) : (
              data.map((row) => (
                <TableRow key={String(row[keyField])}>
                  {columns.map((column) => (
                    <TableCell
                      key={`${String(row[keyField])}-${column.key}`}
                      className={column.className}
                    >
                      {column.render
                        ? column.render(row)
                        : column.cell
                        ? column.cell(row)
                        : column.accessorKey
                        ? String(row[column.accessorKey as keyof T] || "")
                        : String(row[column.key as keyof T] || "")}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {pagination && (pagination.totalCount || pagination.totalPages || pagination.totalItems) && (
        <div className="px-2 py-2 border-t">
          <PaginationController
            currentPage={pagination.pageIndex || 1}
            totalPages={pagination.totalPages || 1}
            onPageChange={pagination.onPageChange || (() => {})}
            pageSize={pagination.pageSize || 10}
            pageSizeOptions={pagination.pageSizeOptions || [10, 25, 50, 100]}
            onPageSizeChange={pagination.onPageSizeChange}
            totalCount={pagination.totalCount || pagination.totalItems || 0}
          />
        </div>
      )}
    </div>
  );
}

export { DataTable };
