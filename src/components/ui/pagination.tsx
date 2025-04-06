
import React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PaginationProps } from "@/types/reports";

export const Pagination: React.FC<PaginationProps> = ({
  itemsCount,
  itemsPerPage,
  currentPage,
  onPageChange,
  onPageSizeChange,
  className,
  children
}) => {
  const totalPages = Math.ceil(itemsCount / itemsPerPage);
  
  if (totalPages <= 1 && !children) {
    return null;
  }

  const generatePagination = () => {
    // Always show first page
    const pagination = [1];
    
    // Calculate range to show
    const rangeStart = Math.max(2, currentPage - 1);
    const rangeEnd = Math.min(totalPages - 1, currentPage + 1);
    
    // Add ellipsis before range if needed
    if (rangeStart > 2) {
      pagination.push(-1); // Use -1 as a marker for ellipsis
    }
    
    // Add range pages
    for (let i = rangeStart; i <= rangeEnd; i++) {
      pagination.push(i);
    }
    
    // Add ellipsis after range if needed
    if (rangeEnd < totalPages - 1) {
      pagination.push(-2); // Use -2 as another marker for ellipsis
    }
    
    // Always show last page if there is more than one page
    if (totalPages > 1) {
      pagination.push(totalPages);
    }
    
    return pagination;
  };
  
  const pages = generatePagination();
  
  return (
    <div className={cn("flex items-center justify-between", className)}>
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous page</span>
        </Button>
        
        {pages.map((page, i) => {
          // Render ellipsis
          if (page < 0) {
            return (
              <Button 
                key={`ellipsis-${i}`}
                variant="outline" 
                size="sm"
                disabled
                className="px-2.5"
              >
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">More pages</span>
              </Button>
            );
          }
          
          // Render page number
          return (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(page)}
              className="px-2.5"
            >
              {page}
            </Button>
          );
        })}
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next page</span>
        </Button>
      </div>
      
      {onPageSizeChange && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Rows per page</span>
          <select
            className="h-8 rounded-md border border-input bg-background px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
            value={itemsPerPage}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      )}
      
      {children}
    </div>
  );
};

export default Pagination;
