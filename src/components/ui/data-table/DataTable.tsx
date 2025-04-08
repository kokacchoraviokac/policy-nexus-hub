
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, RotateCcw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { PaginationController } from "@/components/ui/pagination-controller";

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
  error?: Error | null;
  onRefresh?: () => void;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  emptyMessage?: string;
  className?: string;
  actions?: React.ReactNode;
  pagination?: {
    pageIndex?: number;
    pageSize?: number;
    totalItems?: number;
    totalPages?: number;
    currentPage?: number;
    itemsPerPage?: number;
    onPageChange: (page: number) => void;
    onPageSizeChange?: (pageSize: number) => void;
    pageSizeOptions?: number[];
  };
}

export function DataTable<T, K = unknown>({
  data,
  columns,
  keyField,
  isLoading = false,
  error = null,
  onRefresh,
  searchPlaceholder,
  onSearch,
  emptyMessage,
  className,
  actions,
  pagination
}: DataTableProps<T, K>) {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };
  
  // Loading state
  if (isLoading) {
    return (
      <div className={cn("space-y-4", className)}>
        <div className="flex justify-between items-center">
          <div className="w-1/3">
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="h-10 w-24" />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key} className={column.className}>
                  <Skeleton className="h-4 w-20" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array(5).fill(0).map((_, idx) => (
              <TableRow key={idx}>
                {columns.map((column) => (
                  <TableCell key={`${idx}-${column.key}`} className={column.className}>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="rounded-md bg-destructive/10 p-6 text-center">
        <h4 className="font-medium text-destructive mb-2">{t("errorOccurred")}</h4>
        <p className="text-sm text-muted-foreground mb-4">{error.message}</p>
        {onRefresh && (
          <Button onClick={onRefresh} variant="outline" size="sm">
            <RotateCcw className="mr-2 h-4 w-4" />
            {t("tryAgain")}
          </Button>
        )}
      </div>
    );
  }
  
  // Empty state
  if (data.length === 0) {
    return (
      <div className={cn("space-y-4", className)}>
        {(onSearch || actions) && (
          <div className="flex justify-between items-center mb-4">
            {onSearch && (
              <form onSubmit={handleSearch} className="flex items-center">
                <Input
                  placeholder={searchPlaceholder || t("search")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="max-w-sm"
                />
                <Button type="submit" variant="ghost" size="sm" className="ml-2">
                  <Search className="h-4 w-4" />
                </Button>
              </form>
            )}
            {actions}
          </div>
        )}
        <div className="rounded-md bg-muted/50 p-8 text-center">
          <p className="text-muted-foreground">
            {emptyMessage || t("noDataAvailable")}
          </p>
        </div>
      </div>
    );
  }
  
  // Render table with data
  return (
    <div className={cn("space-y-4", className)}>
      {(onSearch || actions) && (
        <div className="flex justify-between items-center mb-4">
          {onSearch && (
            <form onSubmit={handleSearch} className="flex items-center">
              <Input
                placeholder={searchPlaceholder || t("search")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-sm"
              />
              <Button type="submit" variant="ghost" size="sm" className="ml-2">
                <Search className="h-4 w-4" />
              </Button>
            </form>
          )}
          {actions}
        </div>
      )}
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key} className={column.className}>
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={String(item[keyField])}>
                {columns.map((column) => (
                  <TableCell key={`${String(item[keyField])}-${column.key}`} className={column.className}>
                    {column.render ? column.render(item) : 
                     column.cell ? column.cell(item) : 
                     column.accessorKey ? String(item[column.accessorKey as keyof T] || '') : 
                     String(item[column.key as keyof T] || '')}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {pagination && (
        <div className="p-4 border-t">
          <PaginationController
            currentPage={pagination.currentPage || pagination.pageIndex || 1}
            totalPages={pagination.totalPages || 1}
            itemsPerPage={pagination.itemsPerPage || pagination.pageSize || 10}
            itemsCount={data.length}
            totalItems={pagination.totalItems}
            onPageChange={pagination.onPageChange}
            onPageSizeChange={pagination.onPageSizeChange}
            pageSizeOptions={pagination.pageSizeOptions}
          />
        </div>
      )}
    </div>
  );
}

export default DataTable;
