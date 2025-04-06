
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  itemsCount: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  className?: string;
  children?: React.ReactNode; // Add this to support legacy components
}

export function Pagination({
  currentPage,
  totalPages,
  itemsCount,
  itemsPerPage,
  onPageChange,
  className = "",
  children
}: PaginationProps) {
  // No pages to display
  if (totalPages <= 0) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, itemsCount);

  // Generate page numbers to display
  const generatePageNumbers = () => {
    const pages = [];
    
    // Always show first page
    pages.push(1);
    
    // Logic for middle pages
    if (totalPages <= 7) {
      // If fewer than 7 pages, show all
      for (let i = 2; i < totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Complex logic for many pages
      if (currentPage <= 3) {
        // Near start
        pages.push(2, 3, 4, "ellipsis");
      } else if (currentPage >= totalPages - 2) {
        // Near end
        pages.push("ellipsis", totalPages - 3, totalPages - 2, totalPages - 1);
      } else {
        // Middle - show current and neighbors
        pages.push(
          "ellipsis",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "ellipsis"
        );
      }
    }
    
    // Always show last page if more than one page
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    
    return pages;
  };

  const pageNumbers = generatePageNumbers();

  return (
    <div className={`flex flex-col sm:flex-row justify-between items-center gap-4 ${className}`}>
      <div className="text-sm text-muted-foreground">
        Showing <span className="font-medium">{startItem}</span> to{" "}
        <span className="font-medium">{endItem}</span> of{" "}
        <span className="font-medium">{itemsCount}</span> results
      </div>

      {children}

      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous Page</span>
        </Button>

        <div className="flex items-center">
          {pageNumbers.map((page, i) => {
            if (page === "ellipsis") {
              return (
                <div key={`ellipsis-${i}`} className="px-2">
                  <MoreHorizontal className="h-4 w-4" />
                </div>
              );
            }

            return (
              <Button
                key={`page-${page}`}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(Number(page))}
                className="mx-0.5"
              >
                {page}
              </Button>
            );
          })}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next Page</span>
        </Button>
      </div>
    </div>
  );
}
