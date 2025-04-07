
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
  pageSizeOptions,
  onPageSizeChange,
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
      
      <div className="flex items-center space-x-2">
        {/* First page button */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="h-8 w-8"
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        
        {/* Previous page button */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="h-8 w-8"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        {/* Page numbers */}
        <div className="flex items-center space-x-1">
          {getPageNumbers().map((page, index) => (
            page === "ellipsis-start" || page === "ellipsis-end" ? (
              <div key={`ellipsis-${index}`} className="px-2">...</div>
            ) : (
              <Button
                key={`page-${page}`}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                className="h-8 w-8"
                onClick={() => typeof page === 'number' && onPageChange(page)}
              >
                {page}
              </Button>
            )
          ))}
        </div>
        
        {/* Next page button */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="h-8 w-8"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        
        {/* Last page button */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="h-8 w-8"
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Page size selector */}
      {pageSizeOptions && onPageSizeChange && (
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">{t("itemsPerPage")}</span>
          <select
            className="h-8 rounded-md border border-input bg-background px-2 text-sm"
            value={itemsPerPage}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default Pagination;
