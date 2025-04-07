
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
import { useLanguage } from "@/contexts/LanguageContext";
import { Loader2, Search, AlertCircle } from "lucide-react";
import { PaginationController } from "@/components/ui/pagination";

export interface Column<T> {
  accessorKey: string;
  header: string;
  cell?: (row: T) => React.ReactNode;
  className?: string;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  emptyState?: {
    title: string;
    description: string;
    action?: React.ReactNode;
  };
  keyField: string;
  pagination?: {
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
    itemsCount: number;
    onPageChange: (page: number) => void;
    onPageSizeChange?: (size: number) => void;
    pageSizeOptions?: number[];
  };
  searchable?: boolean;
  searchPlaceholder?: string;
  onSearch?: (term: string) => void;
  searchTerm?: string;
}

function DataTable<T>({
  columns,
  data,
  isLoading = false,
  emptyState,
  keyField,
  pagination,
  searchable = false,
  searchPlaceholder,
  onSearch,
  searchTerm: externalSearchTerm,
}: DataTableProps<T>) {
  const { t } = useLanguage();
  const [internalSearchTerm, setInternalSearchTerm] = useState<string>("");
  
  // Determine if we're using controlled or uncontrolled search
  const isControlledSearch = externalSearchTerm !== undefined && onSearch;
  const searchTerm = isControlledSearch ? externalSearchTerm : internalSearchTerm;
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    if (isControlledSearch && onSearch) {
      onSearch(value);
    } else {
      setInternalSearchTerm(value);
    }
  };
  
  // Simple internal filtering for uncontrolled mode
  const filteredData = !isControlledSearch && searchTerm
    ? data.filter((item: any) => 
        Object.values(item).some(
          (val) => 
            val && 
            typeof val === "string" && 
            val.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    : data;
  
  // Use filteredData for uncontrolled search, or data for controlled search
  const displayData = isControlledSearch ? data : filteredData;
  
  // Determine if we should show empty state
  const showEmptyState = !isLoading && displayData.length === 0;
  
  // Access key function to get the unique key from each row
  const getRowKey = (row: any) => row[keyField] || JSON.stringify(row);
  
  return (
    <div className="space-y-4">
      {searchable && (
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder || t("search")}
            className="pl-8"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      )}
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.accessorKey} className={column.className}>
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <div className="flex justify-center items-center h-full">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                </TableCell>
              </TableRow>
            ) : showEmptyState ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <div className="flex flex-col items-center justify-center">
                    <AlertCircle className="h-10 w-10 text-muted-foreground mb-2" />
                    <h3 className="text-lg font-medium">
                      {emptyState?.title || t("noData")}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {emptyState?.description || t("noDataDescription")}
                    </p>
                    {emptyState?.action && (
                      <div className="mt-4">{emptyState.action}</div>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              displayData.map((row: any) => (
                <TableRow key={getRowKey(row)}>
                  {columns.map((column) => (
                    <TableCell key={`${getRowKey(row)}-${column.accessorKey}`}>
                      {column.cell
                        ? column.cell(row)
                        : row[column.accessorKey] || "-"}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {pagination && displayData.length > 0 && (
        <PaginationController
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={pagination.onPageChange}
          itemsPerPage={pagination.itemsPerPage}
          itemsCount={pagination.itemsCount}
          onPageSizeChange={pagination.onPageSizeChange}
          pageSizeOptions={pagination.pageSizeOptions}
        />
      )}
    </div>
  );
}

export default DataTable;
