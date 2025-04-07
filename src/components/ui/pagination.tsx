
import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { PaginationProps } from "@/types/pagination";

const Pagination: React.FC<PaginationProps> = ({
  totalPages,
  currentPage,
  onPageChange,
  itemsCount,
  itemsPerPage,
  className,
}) => {
  const { t } = useLanguage();

  // Generate page numbers to display
  const getPageNumbers = () => {
    const visiblePages = 5; // Number of page buttons to show
    const pages = [];
    
    if (totalPages <= visiblePages) {
      // Show all pages if total is less than visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      // Calculate start and end of visible pages
      let startPage = Math.max(2, currentPage - Math.floor(visiblePages / 2));
      let endPage = Math.min(totalPages - 1, startPage + visiblePages - 3);
      
      // Adjust if we're at the start
      if (currentPage <= Math.floor(visiblePages / 2) + 1) {
        endPage = visiblePages - 1;
      }
      
      // Adjust if we're at the end
      if (currentPage >= totalPages - Math.floor(visiblePages / 2)) {
        startPage = totalPages - visiblePages + 2;
      }
      
      // Add ellipsis if needed
      if (startPage > 2) {
        pages.push("ellipsis-start");
      }
      
      // Add page numbers
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      // Add ending ellipsis if needed
      if (endPage < totalPages - 1) {
        pages.push("ellipsis-end");
      }
      
      // Always show last page
      pages.push(totalPages);
    }
    
    return pages;
  };

  return (
    <div className={`flex items-center justify-between py-4 ${className || ""}`}>
      {(itemsCount !== undefined && itemsPerPage) && (
        <div className="text-sm text-muted-foreground">
          {t("showingItems", {
            start: ((currentPage - 1) * itemsPerPage) + 1,
            end: Math.min(currentPage * itemsPerPage, itemsCount),
            total: itemsCount
          })}
        </div>
      )}

      <div className="flex items-center space-x-2 ml-auto">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          aria-label={t("firstPage")}
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label={t("previousPage")}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        {getPageNumbers().map((page, idx) => (
          typeof page === 'number' ? (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="icon"
              onClick={() => onPageChange(page)}
              aria-label={t("pageNumber", { page })}
              aria-current={currentPage === page ? "page" : undefined}
            >
              {page}
            </Button>
          ) : (
            <span key={page} className="px-2 text-muted-foreground">...</span>
          )
        ))}
        
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label={t("nextPage")}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          aria-label={t("lastPage")}
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Pagination;

// Also export sub-components for use when needed
export const PaginationContent = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center space-x-2">{children}</div>
);

export const PaginationItem = ({ children }: { children: React.ReactNode }) => (
  <div>{children}</div>
);

export const PaginationLink = ({ 
  page, 
  isActive, 
  onClick 
}: { 
  page: number | string,
  isActive?: boolean,
  onClick: () => void 
}) => (
  <Button
    variant={isActive ? "default" : "outline"}
    size="icon"
    onClick={onClick}
  >
    {page}
  </Button>
);

export const PaginationEllipsis = () => (
  <span className="px-2 text-muted-foreground">...</span>
);

export const PaginationNext = ({ 
  onClick,
  disabled
}: { 
  onClick: () => void,
  disabled?: boolean
}) => (
  <Button
    variant="outline"
    size="icon"
    onClick={onClick}
    disabled={disabled}
  >
    <ChevronRight className="h-4 w-4" />
  </Button>
);

export const PaginationPrevious = ({ 
  onClick,
  disabled
}: { 
  onClick: () => void,
  disabled?: boolean
}) => (
  <Button
    variant="outline"
    size="icon"
    onClick={onClick}
    disabled={disabled}
  >
    <ChevronLeft className="h-4 w-4" />
  </Button>
);
