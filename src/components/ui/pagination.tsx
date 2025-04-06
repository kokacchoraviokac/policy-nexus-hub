
import React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface PaginationProps {
  itemsCount: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  className?: string;
  children?: React.ReactNode;
}

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
      pagination.push(-1); // -1 represents ellipsis
    }
    
    // Add range
    for (let i = rangeStart; i <= rangeEnd; i++) {
      pagination.push(i);
    }
    
    // Add ellipsis after range if needed
    if (rangeEnd < totalPages - 1) {
      pagination.push(-2); // -2 represents ellipsis
    }
    
    // Always show last page if there's more than one page
    if (totalPages > 1) {
      pagination.push(totalPages);
    }
    
    return pagination;
  };

  const pagination = generatePagination();

  // If children are provided, render those instead of the default pagination
  if (children) {
    return <nav className={cn("flex items-center justify-center", className)}>{children}</nav>;
  }

  return (
    <nav className={cn("flex items-center justify-center", className)}>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        {pagination.map((page, index) => {
          // Render ellipsis
          if (page < 0) {
            return (
              <Button 
                key={`ellipsis-${index}`}
                variant="ghost" 
                disabled 
                className="px-3 py-2"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            );
          }
          
          // Render page number
          return (
            <Button
              key={page}
              variant={page === currentPage ? "default" : "outline"}
              size="icon"
              onClick={() => onPageChange(page)}
              aria-current={page === currentPage ? "page" : undefined}
              aria-label={`Page ${page}`}
            >
              {page}
            </Button>
          );
        })}
        
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </nav>
  );
};

// Controller component to handle pagination logic and state
export interface PaginationControllerProps extends PaginationProps {
  pageSizes?: number[];
}

export const PaginationController: React.FC<PaginationControllerProps> = ({
  itemsCount,
  itemsPerPage,
  currentPage,
  onPageChange,
  onPageSizeChange,
  pageSizes = [10, 25, 50, 100],
  className
}) => {
  const totalPages = Math.ceil(itemsCount / itemsPerPage);
  
  // Ensure current page is within valid range
  const safeCurrentPage = Math.max(1, Math.min(currentPage, totalPages || 1));
  
  // Calculate display ranges
  const startItem = (safeCurrentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(safeCurrentPage * itemsPerPage, itemsCount);

  return (
    <div className={cn("flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4", className)}>
      <div className="text-sm text-muted-foreground">
        Showing <span className="font-medium">{itemsCount > 0 ? startItem : 0}</span> to{" "}
        <span className="font-medium">{endItem}</span> of{" "}
        <span className="font-medium">{itemsCount}</span> items
      </div>
      
      <div className="flex items-center gap-4">
        {onPageSizeChange && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Items per page</span>
            <select
              className="h-9 w-16 rounded-md border border-input bg-transparent px-3 py-1 text-sm"
              value={itemsPerPage}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
            >
              {pageSizes.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        )}
        
        <Pagination
          itemsCount={itemsCount}
          itemsPerPage={itemsPerPage}
          currentPage={safeCurrentPage}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
};

// Export these components for backward compatibility
export const PaginationContent: React.FC<{children: React.ReactNode; className?: string}> = ({ children, className }) => (
  <div className={className}>{children}</div>
);

export const PaginationEllipsis: React.FC = () => <MoreHorizontal className="h-4 w-4" />;

export const PaginationItem: React.FC<{children: React.ReactNode}> = ({ children }) => <div>{children}</div>;

export const PaginationLink: React.FC<{
  children: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
}> = ({ children, onClick, isActive }) => (
  <Button 
    variant={isActive ? "default" : "outline"} 
    size="icon" 
    onClick={onClick}
  >
    {children}
  </Button>
);

export const PaginationNext: React.FC<{ 
  onClick?: () => void;
  className?: string;
}> = ({ onClick, className }) => (
  <Button variant="outline" size="icon" onClick={onClick} className={className}>
    <ChevronRight className="h-4 w-4" />
  </Button>
);

export const PaginationPrevious: React.FC<{ 
  onClick?: () => void;
  className?: string;
}> = ({ onClick, className }) => (
  <Button variant="outline" size="icon" onClick={onClick} className={className}>
    <ChevronLeft className="h-4 w-4" />
  </Button>
);
