
import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/utils/shadcn";
import { Button } from "./button";

export interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  itemsCount?: number;
  itemsPerPage?: number;
}

export interface PaginationItemProps {
  page: number;
  isActive?: boolean;
  onClick: () => void;
  children?: React.ReactNode;
  className?: string;
}

export function Pagination({
  totalPages,
  currentPage,
  onPageChange,
  itemsCount,
  itemsPerPage,
}: PaginationProps) {
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    onPageChange(page);
  };

  // Calculate page numbers to show
  const getPageNumbers = () => {
    const pages = [];
    // Always show first page
    pages.push(1);

    // Calculate range around current page
    let startPage = Math.max(2, currentPage - 1);
    let endPage = Math.min(totalPages - 1, currentPage + 1);

    // Ensure we show at least 3 pages (if available)
    if (totalPages > 3) {
      if (startPage === 2) {
        endPage = Math.min(totalPages - 1, 4);
      } else if (endPage === totalPages - 1) {
        startPage = Math.max(2, totalPages - 3);
      }
    }

    // Handle ellipses before current range
    if (startPage > 2) {
      pages.push(-1); // -1 represents ellipsis
    } else if (startPage === 2) {
      pages.push(2);
    }

    // Add pages in range
    for (let i = startPage; i <= endPage; i++) {
      if (i !== 1 && i !== totalPages) {
        pages.push(i);
      }
    }

    // Handle ellipses after current range
    if (endPage < totalPages - 1) {
      pages.push(-2); // -2 represents ellipsis
    } else if (endPage === totalPages - 1) {
      pages.push(totalPages - 1);
    }

    // Always show last page if more than one page
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  // Don't render pagination if there's only one page
  if (totalPages <= 1) {
    return null;
  }

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-between px-2">
      <div className="text-sm text-muted-foreground">
        {itemsCount && itemsPerPage && (
          <>
            Showing {Math.min((currentPage - 1) * itemsPerPage + 1, itemsCount)} to{" "}
            {Math.min(currentPage * itemsPerPage, itemsCount)} of {itemsCount}
          </>
        )}
      </div>
      <nav className="flex items-center space-x-1">
        <PaginationItem
          page={currentPage - 1}
          onClick={() => handlePageChange(currentPage - 1)}
          className={cn(
            "cursor-pointer",
            currentPage <= 1 && "cursor-not-allowed opacity-50"
          )}
        >
          <span className="sr-only">Previous page</span>
          <ChevronLeft className="h-4 w-4" />
        </PaginationItem>

        {pageNumbers.map((page, index) => {
          // Handle ellipses
          if (page < 0) {
            return (
              <span key={`ellipsis-${index}`} className="flex h-8 w-8 items-center justify-center">
                <MoreHorizontal className="h-4 w-4" />
              </span>
            );
          }

          return (
            <PaginationItem
              key={page}
              page={page}
              isActive={page === currentPage}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </PaginationItem>
          );
        })}

        <PaginationItem
          page={currentPage + 1}
          onClick={() => handlePageChange(currentPage + 1)}
          className={cn(
            "cursor-pointer",
            currentPage >= totalPages && "cursor-not-allowed opacity-50"
          )}
        >
          <span className="sr-only">Next page</span>
          <ChevronRight className="h-4 w-4" />
        </PaginationItem>
      </nav>
    </div>
  );
}

export function PaginationItem({
  page,
  isActive,
  onClick,
  children,
  className,
}: PaginationItemProps) {
  return (
    <Button
      variant={isActive ? "default" : "outline"}
      size="icon"
      onClick={onClick}
      className={cn("h-8 w-8", className)}
      aria-current={isActive ? "page" : undefined}
    >
      {children ?? page}
    </Button>
  );
}
