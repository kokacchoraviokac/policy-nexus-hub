
import React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  itemsPerPage?: number;
  itemsCount?: number;
  showPageNumbers?: boolean;
  showEllipsis?: boolean;
  siblingCount?: number;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
  showPageNumbers = true,
  showEllipsis = true,
  siblingCount = 1,
  itemsPerPage,
  itemsCount,
}: PaginationProps) {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  // Generate page numbers to display
  const generatePageNumbers = () => {
    const pageNumbers = [];

    // Always include first page
    pageNumbers.push(1);

    const leftSibling = Math.max(2, currentPage - siblingCount);
    const rightSibling = Math.min(totalPages - 1, currentPage + siblingCount);

    // Add ellipsis if needed
    if (leftSibling > 2 && showEllipsis) {
      pageNumbers.push("ellipsis-left");
    } else if (leftSibling === 2) {
      pageNumbers.push(2);
    }

    // Add pages between left and right siblings
    for (let i = leftSibling; i <= rightSibling; i++) {
      if (i !== 1 && i !== totalPages) {
        pageNumbers.push(i);
      }
    }

    // Add ellipsis if needed
    if (rightSibling < totalPages - 1 && showEllipsis) {
      pageNumbers.push("ellipsis-right");
    } else if (rightSibling === totalPages - 1) {
      pageNumbers.push(totalPages - 1);
    }

    // Always include last page if there's more than one page
    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav
      className={cn(
        "flex items-center justify-between px-2 sm:px-0",
        className
      )}
      aria-label="Pagination"
    >
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        {itemsCount && itemsPerPage && (
          <div className="text-sm text-muted-foreground">
            Showing <span className="font-medium">{Math.min((currentPage - 1) * (itemsPerPage || 10) + 1, itemsCount)}</span> to{" "}
            <span className="font-medium">{Math.min(currentPage * (itemsPerPage || 10), itemsCount)}</span> of{" "}
            <span className="font-medium">{itemsCount}</span> results
          </div>
        )}
        <div>
          <ul className="inline-flex -space-x-px">
            <li>
              <Button
                onClick={handlePrevious}
                disabled={currentPage === 1}
                variant="outline"
                size="icon"
                className="rounded-r-none"
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </li>
            {showPageNumbers &&
              generatePageNumbers().map((pageNumber, index) => {
                if (pageNumber === "ellipsis-left" || pageNumber === "ellipsis-right") {
                  return (
                    <li key={`ellipsis-${index}`}>
                      <span className="flex items-center justify-center px-3 h-9 text-sm border border-input bg-background text-muted-foreground">
                        <MoreHorizontal className="h-4 w-4" />
                      </span>
                    </li>
                  );
                }
                
                const isCurrentPage = pageNumber === currentPage;
                
                return (
                  <li key={`page-${pageNumber}`}>
                    <Button
                      onClick={() => onPageChange(pageNumber as number)}
                      variant={isCurrentPage ? "default" : "outline"}
                      size="icon"
                      className={cn(
                        "rounded-none px-3 w-9",
                        isCurrentPage ? "z-10" : ""
                      )}
                      aria-current={isCurrentPage ? "page" : undefined}
                    >
                      {pageNumber}
                    </Button>
                  </li>
                );
              })}
            <li>
              <Button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                variant="outline"
                size="icon"
                className="rounded-l-none"
                aria-label="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </li>
          </ul>
        </div>
      </div>
      <div className="flex sm:hidden w-full justify-between">
        <Button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          variant="outline"
          size="sm"
          className="px-2"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>
        <span className="flex items-center text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          variant="outline"
          size="sm"
          className="px-2"
        >
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </nav>
  );
}
