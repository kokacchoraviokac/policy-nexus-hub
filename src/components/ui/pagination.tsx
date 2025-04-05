
import React from "react";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { cn } from "@/utils/cn";

export interface PaginationProps {
  itemsCount: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  pageSize?: number;  // Added optional pageSize
  onPageSizeChange?: (pageSize: number) => void;  // Added optional handler
  className?: string;
  showPageInfo?: boolean;
}

export function Pagination({
  itemsCount,
  itemsPerPage,
  currentPage,
  onPageChange,
  pageSize,
  onPageSizeChange,
  className,
  showPageInfo = true,
  ...props
}: PaginationProps & React.HTMLAttributes<HTMLDivElement>) {
  const pageCount = Math.ceil(itemsCount / itemsPerPage);
  
  // Handle cases where itemsCount is 0
  const safePageCount = Math.max(1, pageCount);
  
  // Ensure currentPage is valid
  const safeCurrentPage = Math.min(Math.max(1, currentPage), safePageCount);
  
  // Calculate visible pages
  const visiblePages = [];
  const pagesToShow = 5;
  
  let startPage = Math.max(1, safeCurrentPage - Math.floor(pagesToShow / 2));
  let endPage = Math.min(safePageCount, startPage + pagesToShow - 1);
  
  // Adjust start page if end page is maxed out
  if (endPage === safePageCount) {
    startPage = Math.max(1, endPage - pagesToShow + 1);
  }
  
  for (let i = startPage; i <= endPage; i++) {
    visiblePages.push(i);
  }
  
  return (
    <div className={cn("flex flex-col sm:flex-row items-center gap-4 py-4", className)} {...props}>
      {showPageInfo && pageCount > 0 && (
        <div className="text-sm text-muted-foreground">
          Showing {(safeCurrentPage - 1) * itemsPerPage + 1} to {Math.min(safeCurrentPage * itemsPerPage, itemsCount)} of {itemsCount} entries
        </div>
      )}
      <div className="ml-auto flex items-center gap-1">
        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={() => onPageChange(1)}
          disabled={safeCurrentPage === 1}
        >
          <span className="sr-only">Go to first page</span>
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={() => onPageChange(safeCurrentPage - 1)}
          disabled={safeCurrentPage === 1}
        >
          <span className="sr-only">Go to previous page</span>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        {visiblePages.map((page) => (
          <Button
            key={page}
            variant={page === safeCurrentPage ? "default" : "outline"}
            className="h-8 w-8 p-0"
            onClick={() => onPageChange(page)}
          >
            <span>{page}</span>
          </Button>
        ))}
        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={() => onPageChange(safeCurrentPage + 1)}
          disabled={safeCurrentPage === safePageCount}
        >
          <span className="sr-only">Go to next page</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={() => onPageChange(safePageCount)}
          disabled={safeCurrentPage === safePageCount}
        >
          <span className="sr-only">Go to last page</span>
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
