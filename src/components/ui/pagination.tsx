
import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface PaginationProps extends React.HTMLAttributes<HTMLElement> {
  itemsCount: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  itemsCount,
  itemsPerPage,
  currentPage,
  onPageChange,
  className,
  ...props
}: PaginationProps) {
  const totalPages = Math.ceil(itemsCount / itemsPerPage);
  
  const renderPageNumbers = () => {
    let pages = [];
    
    // Always show first page
    pages.push(
      <Button
        key="page-1"
        variant={currentPage === 1 ? "default" : "outline"}
        size="icon"
        onClick={() => onPageChange(1)}
        className="h-8 w-8"
      >
        1
      </Button>
    );
    
    // Handle ellipsis and middle pages
    if (totalPages <= 7) {
      // Show all pages if 7 or fewer
      for (let i = 2; i < totalPages; i++) {
        pages.push(
          <Button
            key={`page-${i}`}
            variant={currentPage === i ? "default" : "outline"}
            size="icon"
            onClick={() => onPageChange(i)}
            className="h-8 w-8"
          >
            {i}
          </Button>
        );
      }
    } else {
      // Complex pagination with ellipsis
      if (currentPage > 3) {
        pages.push(
          <span key="ellipsis-1" className="px-2">
            ...
          </span>
        );
      }
      
      // Calculate range of visible pages
      const rangeStart = Math.max(2, currentPage - 1);
      const rangeEnd = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = rangeStart; i <= rangeEnd; i++) {
        pages.push(
          <Button
            key={`page-${i}`}
            variant={currentPage === i ? "default" : "outline"}
            size="icon"
            onClick={() => onPageChange(i)}
            className="h-8 w-8"
          >
            {i}
          </Button>
        );
      }
      
      if (currentPage < totalPages - 2) {
        pages.push(
          <span key="ellipsis-2" className="px-2">
            ...
          </span>
        );
      }
    }
    
    // Always show last page if more than 1 page
    if (totalPages > 1) {
      pages.push(
        <Button
          key={`page-${totalPages}`}
          variant={currentPage === totalPages ? "default" : "outline"}
          size="icon"
          onClick={() => onPageChange(totalPages)}
          className="h-8 w-8"
        >
          {totalPages}
        </Button>
      );
    }
    
    return pages;
  };
  
  return (
    <div className={cn("flex items-center space-x-2", className)} {...props}>
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="h-8 w-8"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      {renderPageNumbers()}
      
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages || totalPages === 0}
        className="h-8 w-8"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
