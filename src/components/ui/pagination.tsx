
import React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsCount?: number;
  itemsPerPage?: number;
  pageSizeOptions?: number[];
  onPageSizeChange?: (pageSize: number) => void;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  itemsCount,
  itemsPerPage,
  pageSizeOptions = [10, 25, 50, 100],
  onPageSizeChange,
  className,
}) => {
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if there are few
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      // Calculate middle range
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      
      // Adjust if we're near the start
      if (currentPage <= 3) {
        endPage = 4;
      }
      
      // Adjust if we're near the end
      if (currentPage >= totalPages - 2) {
        startPage = totalPages - 3;
      }
      
      // Add ellipsis if needed at start
      if (startPage > 2) {
        pages.push(-1); // -1 represents ellipsis
      }
      
      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      // Add ellipsis if needed at end
      if (endPage < totalPages - 1) {
        pages.push(-2); // -2 represents ellipsis
      }
      
      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className={cn("flex items-center justify-between", className)}>
      <div className="flex-1 text-sm text-muted-foreground">
        {itemsCount !== undefined && itemsPerPage !== undefined && (
          <div>
            Showing <span className="font-medium">{Math.min((currentPage - 1) * itemsPerPage + 1, itemsCount)}</span>
            {" "} to {" "}
            <span className="font-medium">{Math.min(currentPage * itemsPerPage, itemsCount)}</span>
            {" "} of {" "}
            <span className="font-medium">{itemsCount}</span> results
          </div>
        )}
      </div>
      
      <div className="flex items-center space-x-6 lg:space-x-8">
        {onPageSizeChange && (
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <select
              className="h-8 w-[70px] rounded-md border border-input bg-transparent px-2 py-1 text-sm"
              value={itemsPerPage}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        )}
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 p-0"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={isFirstPage}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center">
            {getPageNumbers().map((page, i) => {
              if (page < 0) {
                return (
                  <div key={`ellipsis-${i}`} className="px-2">
                    <MoreHorizontal className="h-4 w-4" />
                  </div>
                );
              }
              
              return (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="icon"
                  className="h-8 w-8 p-0"
                  onClick={() => onPageChange(page)}
                >
                  <span className="sr-only">Go to page {page}</span>
                  {page}
                </Button>
              );
            })}
          </div>
          
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 p-0"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={isLastPage}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
