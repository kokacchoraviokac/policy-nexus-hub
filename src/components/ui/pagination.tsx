
import React from "react";
import { cn } from "@/utils/shadcn";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Button } from "./button";

export interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  itemsCount?: number;
  itemsPerPage?: number;
  className?: string;
}

export interface PaginationItemProps {
  page: number;
  onClick: () => void;
  isActive?: boolean;
  children?: React.ReactNode;
  disabled?: boolean;
}

export const Pagination = ({
  totalPages,
  currentPage,
  onPageChange,
  itemsCount,
  itemsPerPage,
  className,
}: PaginationProps) => {
  // Default to showing 5 pages (previous, current, next, and the first/last)
  const maxVisiblePages = 5;

  if (totalPages <= 1) {
    return null;
  }

  // Create array of visible page numbers
  const getVisiblePages = () => {
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Always show first page, last page, current page, and pages around current
    let pages = [1];

    const leftSide = Math.max(2, currentPage - 1);
    const rightSide = Math.min(totalPages - 1, currentPage + 1);

    // Add ellipsis on the left if needed
    if (leftSide > 2) {
      pages.push(-1); // Use -1 as a marker for left ellipsis
    }

    // Add pages around current page
    for (let i = leftSide; i <= rightSide; i++) {
      pages.push(i);
    }

    // Add ellipsis on the right if needed
    if (rightSide < totalPages - 1) {
      pages.push(-2); // Use -2 as a marker for right ellipsis
    }

    // Add last page
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <nav className={cn("flex items-center justify-center space-x-2", className)}>
      <PaginationItem 
        page={currentPage - 1} 
        onClick={() => onPageChange(currentPage - 1)} 
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Previous page</span>
      </PaginationItem>

      {visiblePages.map((page, i) => {
        // Render ellipsis
        if (page < 0) {
          return (
            <div key={`ellipsis-${i}`} className="flex items-center justify-center px-4 py-2">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">More pages</span>
            </div>
          );
        }

        // Render actual page
        return (
          <PaginationItem
            key={page}
            page={page}
            onClick={() => onPageChange(page)}
            isActive={page === currentPage}
          >
            {page}
          </PaginationItem>
        );
      })}

      <PaginationItem 
        page={currentPage + 1} 
        onClick={() => onPageChange(currentPage + 1)} 
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Next page</span>
      </PaginationItem>
    </nav>
  );
};

export const PaginationItem: React.FC<PaginationItemProps> = ({ 
  page, 
  onClick, 
  isActive,
  children,
  disabled
}) => {
  return (
    <Button
      variant={isActive ? "default" : "outline"}
      size="icon"
      className={cn("h-9 w-9", {
        "pointer-events-none": disabled
      })}
      onClick={() => !isActive && !disabled && onClick()}
      disabled={disabled}
    >
      {children || page}
    </Button>
  );
};
