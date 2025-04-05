
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

export interface PaginationProps {
  itemsCount: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  pageSize?: number;
  onPageSizeChange?: (size: number) => void;
  totalPages?: number;
  totalItems?: number;
  pageSizeOptions?: number[];
  className?: string;
  children?: React.ReactNode;
}

export const Pagination: React.FC<PaginationProps> = ({
  itemsCount,
  itemsPerPage,
  currentPage,
  onPageChange,
  className,
  children,
}) => {
  // Calculate total pages
  const totalPages = Math.ceil(itemsCount / itemsPerPage);
  
  // Do not render if there is only one page or no items
  if (totalPages <= 1 || itemsCount === 0) {
    return null;
  }
  
  // Calculate the range of pages to show
  const getPageRange = () => {
    const maxButtons = 5; // Maximum number of page buttons to show (odd number recommended)
    const halfMaxButtons = Math.floor(maxButtons / 2);
    
    if (totalPages <= maxButtons) {
      // If total pages is less than or equal to maxButtons, show all pages
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    if (currentPage <= halfMaxButtons + 1) {
      // We're near the start, show first maxButtons
      return Array.from({ length: maxButtons }, (_, i) => i + 1);
    }
    
    if (currentPage >= totalPages - halfMaxButtons) {
      // We're near the end, show last maxButtons
      return Array.from({ length: maxButtons }, (_, i) => totalPages - maxButtons + i + 1);
    }
    
    // We're in the middle, show currentPage and surrounding pages
    return Array.from(
      { length: maxButtons },
      (_, i) => currentPage - halfMaxButtons + i
    );
  };
  
  const pageRange = getPageRange();
  
  return (
    <div className={`flex justify-center items-center space-x-2 py-2 ${className}`}>
      {/* First Page Button */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className="hidden sm:flex"
      >
        <ChevronsLeft className="h-4 w-4" />
      </Button>
      
      {/* Previous Page Button */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      {/* Page Number Buttons */}
      {pageRange.map(page => (
        <Button
          key={page}
          variant={currentPage === page ? "default" : "outline"}
          size="sm"
          onClick={() => onPageChange(page)}
          className="hidden sm:flex"
        >
          {page}
        </Button>
      ))}
      
      {/* Page Indicator for Mobile */}
      <div className="sm:hidden">
        <span className="text-sm">
          {currentPage} / {totalPages}
        </span>
      </div>
      
      {/* Next Page Button */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
      
      {/* Last Page Button */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className="hidden sm:flex"
      >
        <ChevronsRight className="h-4 w-4" />
      </Button>
      
      {/* Additional children (if provided) */}
      {children}
    </div>
  );
};
