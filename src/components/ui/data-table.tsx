
import React, { useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PaginationController } from "./pagination-controller";
import { Input } from "./input";
import { useLanguage } from "@/contexts/LanguageContext";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey?: string;
  searchPlaceholder?: string;
  pagination?: boolean;
  pageSize?: number;
  pageSizeOptions?: number[];
  showPageSizeOptions?: boolean;
  totalCount?: number;
  serverPagination?: boolean;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  searchPlaceholder,
  pagination = true,
  pageSize = 10,
  pageSizeOptions = [10, 25, 50, 100],
  showPageSizeOptions = true,
  totalCount,
  serverPagination = false,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  onPageSizeChange,
}: DataTableProps<TData, TValue>) {
  const { t } = useLanguage();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [localPageSize, setLocalPageSize] = useState(pageSize);
  
  // Create the table instance
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: serverPagination ? undefined : getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      // Only set pagination for client-side pagination
      ...(serverPagination ? {} : { pagination: { pageIndex: currentPage - 1, pageSize: localPageSize } }),
    },
    // Set manual pagination if server pagination is enabled
    manualPagination: serverPagination,
    // Provide the pageCount for server pagination
    pageCount: serverPagination ? totalPages : undefined,
  });
  
  // Handle local page size change
  const handleLocalPageSizeChange = (size: number) => {
    setLocalPageSize(size);
    table.setPageSize(size);
    if (onPageSizeChange) {
      onPageSizeChange(size);
    }
  };
  
  // Handle page change
  const handlePageChange = (page: number) => {
    if (serverPagination && onPageChange) {
      onPageChange(page);
    } else {
      table.setPageIndex(page - 1);
    }
  };
  
  const getItemsCount = () => {
    if (serverPagination) {
      return data.length;
    } else {
      return table.getRowModel().rows.length;
    }
  };
  
  return (
    <div>
      {searchKey && (
        <div className="flex items-center py-4">
          <Input
            placeholder={searchPlaceholder || t("search")}
            value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn(searchKey)?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        </div>
      )}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {t("noResults")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {pagination && (
        <div className="py-4">
          <PaginationController
            currentPage={serverPagination ? currentPage : table.getState().pagination.pageIndex + 1}
            totalPages={serverPagination ? totalPages : table.getPageCount()}
            itemsPerPage={serverPagination ? localPageSize : table.getState().pagination.pageSize}
            onPageChange={handlePageChange}
            onPageSizeChange={showPageSizeOptions ? handleLocalPageSizeChange : undefined}
            pageSizeOptions={pageSizeOptions}
            totalItems={totalCount || table.getFilteredRowModel().rows.length}
            itemsCount={getItemsCount()}
          />
        </div>
      )}
    </div>
  );
}
