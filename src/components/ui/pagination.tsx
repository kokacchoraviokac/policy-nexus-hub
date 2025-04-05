
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./button";
import { PaginationProps } from "@/types/reports";

export const Pagination: React.FC<PaginationProps> = ({
  itemsCount,
  itemsPerPage,
  currentPage,
  onPageChange,
  pageSize,
  onPageSizeChange
}) => {
  const totalPages = Math.ceil(itemsCount / itemsPerPage);
  
  // If there's only 1 page or no items, don't render pagination
  if (totalPages <= 1 || itemsCount === 0) {
    return null;
  }
  
  // Generate page numbers to display
  const getPageNumbers = () => {
    // Always show first & last, plus current and 1 on each side
    // [1, ..., currentPage-1, currentPage, currentPage+1, ..., totalPages]
    const pages: (number | 'ellipsis')[] = [];
    
    if (totalPages <= 7) {
      // Show all pages if there are 7 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always add page 1
      pages.push(1);
      
      // If current page is far from beginning, add ellipsis
      if (currentPage > 3) {
        pages.push('ellipsis');
      }
      
      // Pages around current page
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      // If current page is far from end, add ellipsis
      if (currentPage < totalPages - 2) {
        pages.push('ellipsis');
      }
      
      // Always add last page
      pages.push(totalPages);
    }
    
    return pages;
  };
  
  return (
    <div className="flex items-center justify-between px-2 py-4">
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="h-8 w-8 p-0"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous page</span>
        </Button>
        
        {getPageNumbers().map((page, i) => 
          page === 'ellipsis' ? (
            <span key={`ellipsis-${i}`} className="w-8 text-center">...</span>
          ) : (
            <PaginationButton
              key={`page-${page}`}
              isActive={page === currentPage}
              onClick={() => onPageChange(page)}
            >
              {page}
            </PaginationButton>
          )
        )}
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="h-8 w-8 p-0"
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next page</span>
        </Button>
      </div>
      
      {onPageSizeChange && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Items per page:
          </span>
          <select
            className="h-8 rounded-md border border-input bg-background px-2 text-sm"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
          >
            {[10, 25, 50, 100].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

const PaginationButton: React.FC<{
  children: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}> = ({ children, isActive, onClick }) => {
  return (
    <Button
      variant={isActive ? "default" : "outline"}
      size="sm"
      className={`h-8 w-8 p-0 ${isActive ? "pointer-events-none" : ""}`}
      onClick={onClick}
    >
      {children}
    </Button>
  );
};

export default Pagination;
