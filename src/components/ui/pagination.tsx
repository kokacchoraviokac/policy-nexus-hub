
import React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export interface PaginationProps extends React.HTMLAttributes<HTMLElement> {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
}

export interface PaginationItemProps extends React.HTMLAttributes<HTMLAnchorElement> {
  isActive?: boolean;
  isDisabled?: boolean;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
}

export const PaginationItem: React.FC<PaginationItemProps> = ({
  className,
  isActive,
  isDisabled,
  children,
  ...props
}) => {
  return (
    <a
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-md border text-sm transition-colors",
        isActive
          ? "border-primary bg-primary text-primary-foreground"
          : "border-input bg-background hover:bg-accent hover:text-accent-foreground",
        isDisabled && "pointer-events-none opacity-50",
        className
      )}
      {...props}
    >
      {children}
    </a>
  );
};

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  className,
  ...props
}) => {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const totalNumbers = siblingCount * 2 + 3; // siblings + current + first + last
    const totalButtons = totalNumbers + 2; // +2 for the ellipses

    if (totalPages <= totalButtons) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const showLeftDots = leftSiblingIndex > 2;
    const showRightDots = rightSiblingIndex < totalPages - 1;

    if (!showLeftDots && showRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      return Array.from({ length: leftItemCount }, (_, i) => i + 1).concat(["ellipsis", totalPages]);
    }

    if (showLeftDots && !showRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      return [1, "left-ellipsis"].concat(
        Array.from(
          { length: rightItemCount },
          (_, i) => totalPages - rightItemCount + i + 1
        )
      );
    }

    if (showLeftDots && showRightDots) {
      return [1, "left-ellipsis"]
        .concat(
          Array.from(
            { length: rightSiblingIndex - leftSiblingIndex + 1 },
            (_, i) => leftSiblingIndex + i
          )
        )
        .concat(["right-ellipsis", totalPages]);
    }

    return [];
  };

  const pages = getPageNumbers();

  if (totalPages <= 1) return null;

  return (
    <nav
      className={cn("flex items-center justify-center space-x-2", className)}
      {...props}
    >
      <PaginationItem
        onClick={(e) => {
          e.preventDefault();
          if (currentPage > 1) onPageChange(currentPage - 1);
        }}
        isDisabled={currentPage === 1}
        aria-label="Go to previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </PaginationItem>

      {pages.map((page, i) => {
        if (page === "ellipsis" || page === "left-ellipsis" || page === "right-ellipsis") {
          return (
            <PaginationItem
              key={`ellipsis-${i}`}
              isDisabled
              className="h-9 w-9"
            >
              <MoreHorizontal className="h-4 w-4" />
            </PaginationItem>
          );
        }

        return (
          <PaginationItem
            key={`page-${page}`}
            isActive={page === currentPage}
            onClick={(e) => {
              e.preventDefault();
              onPageChange(page as number);
            }}
          >
            {page}
          </PaginationItem>
        );
      })}

      <PaginationItem
        onClick={(e) => {
          e.preventDefault();
          if (currentPage < totalPages) onPageChange(currentPage + 1);
        }}
        isDisabled={currentPage === totalPages}
        aria-label="Go to next page"
      >
        <ChevronRight className="h-4 w-4" />
      </PaginationItem>
    </nav>
  );
};

export { Pagination };

// Also create a PaginationController component for standardizing pagination
export interface PaginationControllerProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage?: number;
  totalItems?: number;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
}

export const PaginationController: React.FC<PaginationControllerProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  totalItems,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
      {totalItems !== undefined && (
        <div className="text-sm text-muted-foreground">
          Showing {(currentPage - 1) * (itemsPerPage || 10) + 1} to{" "}
          {Math.min(currentPage * (itemsPerPage || 10), totalItems)} of {totalItems} results
        </div>
      )}
      
      <div className="flex items-center gap-2">
        {onPageSizeChange && itemsPerPage && (
          <select
            value={itemsPerPage}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="h-8 w-[70px] rounded-md border border-input bg-background px-2 text-xs"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        )}
        
        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={onPageChange} 
        />
      </div>
    </div>
  );
};
