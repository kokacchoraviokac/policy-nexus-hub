
import React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { Button } from './button';

export interface PaginationProps {
  currentPage: number;
  totalPages?: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  itemsCount?: number; // Support older implementations
  itemsPerPage?: number;
  children?: React.ReactNode; // Support children prop
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages: propsTotalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
  itemsCount, // Support older implementations
  children, // Support children prop
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
  className
}: PaginationProps) {
  // Calculate total pages if not provided directly
  const displayedTotalItems = totalItems || itemsCount;
  const calculatedTotalPages = displayedTotalItems && itemsPerPage 
    ? Math.ceil(displayedTotalItems / itemsPerPage) 
    : propsTotalPages || 1;
  
  // Generate an array of page numbers to display
  const pageNumbers: (number | string)[] = [];
  const maxPagesToShow = 5;
  
  if (calculatedTotalPages <= maxPagesToShow) {
    // If there are less pages than maxPagesToShow, show all pages
    for (let i = 1; i <= calculatedTotalPages; i++) {
      pageNumbers.push(i);
    }
  } else {
    // Always include the first page
    pageNumbers.push(1);
    
    // Calculate the start and end of the page range to show
    let start = Math.max(2, currentPage - Math.floor(maxPagesToShow / 2));
    let end = Math.min(calculatedTotalPages - 1, start + maxPagesToShow - 3);
    
    // Adjust start if we're near the end
    start = Math.max(2, end - (maxPagesToShow - 3));
    
    // Add ellipsis if there's a gap after the first page
    if (start > 2) {
      pageNumbers.push('...');
    }
    
    // Add the middle pages
    for (let i = start; i <= end; i++) {
      pageNumbers.push(i);
    }
    
    // Add ellipsis if there's a gap before the last page
    if (end < calculatedTotalPages - 1) {
      pageNumbers.push('...');
    }
    
    // Always include the last page
    pageNumbers.push(calculatedTotalPages);
  }
  
  return (
    <div className={`flex items-center justify-between ${className || ''}`}>
      {/* Render children if provided */}
      {children}
      
      <div className="flex items-center space-x-6 lg:space-x-8">
        {onPageSizeChange && pageSizeOptions && (
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <select
              className="h-8 w-[70px] rounded-md border border-input bg-transparent"
              value={itemsPerPage}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
            >
              {pageSizeOptions.map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
          </div>
        )}
        
        {displayedTotalItems && (
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Page {currentPage} of {calculatedTotalPages}
          </div>
        )}
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronLeft className="h-4 w-4" />
            <ChevronLeft className="h-4 w-4 -ml-2" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          {pageNumbers.map((page, index) => (
            <React.Fragment key={index}>
              {page === '...' ? (
                <span className="flex h-8 w-8 items-center justify-center">
                  <MoreHorizontal className="h-4 w-4" />
                </span>
              ) : (
                <Button
                  variant={currentPage === page ? "default" : "outline"}
                  className="h-8 w-8 p-0"
                  onClick={() => typeof page === 'number' && onPageChange(page)}
                >
                  <span className="sr-only">Go to page {page}</span>
                  {page}
                </Button>
              )}
            </React.Fragment>
          ))}
          
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === calculatedTotalPages}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => onPageChange(calculatedTotalPages)}
            disabled={currentPage === calculatedTotalPages}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronRight className="h-4 w-4" />
            <ChevronRight className="h-4 w-4 -ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// Export pagination component parts for compatibility 
export const PaginationContent: React.FC<{children: React.ReactNode}> = ({ children }) => (
  <div className="flex items-center space-x-1">{children}</div>
);

export const PaginationEllipsis: React.FC = () => (
  <div className="flex h-9 w-9 items-center justify-center">
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </div>
);

export const PaginationItem: React.FC<{children: React.ReactNode}> = ({ children }) => (
  <div>{children}</div>
);

export const PaginationLink: React.FC<{
  children: React.ReactNode;
  isActive?: boolean;
  [key: string]: any;
}> = ({ 
  children, 
  isActive, 
  ...props 
}) => (
  <Button 
    variant={isActive ? "default" : "outline"} 
    size="icon" 
    {...props}
  >
    {children}
  </Button>
);

export const PaginationNext: React.FC<{[key: string]: any}> = ({ ...props }) => (
  <Button variant="outline" size="icon" {...props}>
    <ChevronRight className="h-4 w-4" />
    <span className="sr-only">Next page</span>
  </Button>
);

export const PaginationPrevious: React.FC<{[key: string]: any}> = ({ ...props }) => (
  <Button variant="outline" size="icon" {...props}>
    <ChevronLeft className="h-4 w-4" />
    <span className="sr-only">Previous page</span>
  </Button>
);
