
import React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/utils/cn";
import { Button } from "./button";
import { PaginationProps } from "@/types/reports";

export const Pagination: React.FC<PaginationProps> = ({
  itemsCount,
  itemsPerPage,
  currentPage,
  onPageChange,
  pageSize = 10,
  onPageSizeChange,
  children
}) => {
  const totalPages = Math.ceil(itemsCount / itemsPerPage);
  
  // Don't render if there's only one page or no items
  if (totalPages <= 1 || itemsCount === 0) {
    return null;
  }
  
  // Handle page change
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    onPageChange(page);
  };
  
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    
    // Always show first page
    pages.push(1);
    
    // Calculate range of pages to show around current page
    let rangeStart = Math.max(2, currentPage - 1);
    let rangeEnd = Math.min(totalPages - 1, currentPage + 1);
    
    // Add ellipsis if necessary
    if (rangeStart > 2) {
      pages.push(-1); // -1 represents ellipsis
    }
    
    // Add pages in the range
    for (let i = rangeStart; i <= rangeEnd; i++) {
      pages.push(i);
    }
    
    // Add ellipsis if necessary
    if (rangeEnd < totalPages - 1) {
      pages.push(-2); // -2 represents ellipsis
    }
    
    // Always show last page if more than one page
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    
    return pages;
  };
  
  return (
    <nav className="flex items-center justify-between">
      <div className="flex-1 flex justify-between sm:hidden">
        <Button
          variant="outline"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>
        <Button
          variant="outline" 
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
      
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        {/* Optional page size selector */}
        {onPageSizeChange && (
          <div className="flex items-center text-sm text-muted-foreground">
            <span className="mr-2">Show</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="h-8 rounded-md border border-input bg-background px-2 py-1 text-sm"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="ml-2">per page</span>
          </div>
        )}
        
        {/* Page navigation */}
        <div>
          <div className="flex space-x-1">
            {/* Previous button */}
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            {/* Page numbers */}
            {getPageNumbers().map((page, index) => {
              if (page < 0) {
                // Render ellipsis
                return (
                  <span 
                    key={`ellipsis-${index}`}
                    className="flex h-8 w-8 items-center justify-center text-muted-foreground"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </span>
                );
              }
              
              return (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  className={cn(
                    "h-8 w-8 p-0",
                    currentPage === page && "pointer-events-none"
                  )}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </Button>
              );
            })}
            
            {/* Next button */}
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      {children}
    </nav>
  );
};

// Export pagination related components
export const PaginationContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-row items-center gap-1", className)}
    {...props}
  />
));
PaginationContent.displayName = "PaginationContent";

export const PaginationEllipsis = () => (
  <span className="flex h-9 w-9 items-center justify-center">
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
);

export const PaginationItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-row items-center", className)}
    {...props}
  />
));
PaginationItem.displayName = "PaginationItem";

export const PaginationLink = ({
  className,
  isActive,
  ...props
}: React.ComponentProps<"button"> & { isActive?: boolean }) => (
  <Button
    variant={isActive ? "default" : "outline"}
    className={cn("h-9 w-9", className)}
    {...props}
  />
);

export const PaginationNext = ({
  className,
  ...props
}: React.ComponentProps<"button">) => (
  <Button
    variant="outline"
    className={cn("h-9 w-9 p-0", className)}
    {...props}
  >
    <ChevronRight className="h-4 w-4" />
    <span className="sr-only">Next page</span>
  </Button>
);

export const PaginationPrevious = ({
  className,
  ...props
}: React.ComponentProps<"button">) => (
  <Button
    variant="outline"
    className={cn("h-9 w-9 p-0", className)}
    {...props}
  >
    <ChevronLeft className="h-4 w-4" />
    <span className="sr-only">Previous page</span>
  </Button>
);
