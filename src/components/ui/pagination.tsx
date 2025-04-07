
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  itemsCount?: number;
  itemsPerPage?: number;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  totalPages,
  currentPage,
  onPageChange,
  itemsCount,
  itemsPerPage = 10,
  className,
}) => {
  const { t } = useLanguage();
  const maxPageButtons = 5;

  // No pagination needed if only one page
  if (totalPages <= 1) return null;

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    onPageChange(page);
  };

  // Calculate visible page buttons
  const getVisiblePages = () => {
    if (totalPages <= maxPageButtons) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Always show first and last page
    const firstPage = 1;
    const lastPage = totalPages;

    // Calculate middle pages
    let startPage = Math.max(currentPage - Math.floor(maxPageButtons / 2), firstPage);
    let endPage = Math.min(startPage + maxPageButtons - 1, lastPage);

    // Adjust if we're near the end
    if (endPage === lastPage) {
      startPage = Math.max(lastPage - maxPageButtons + 1, firstPage);
    }

    const pages = [];
    
    // Add first page if not included in range
    if (startPage > firstPage) {
      pages.push(firstPage);
      if (startPage > firstPage + 1) {
        pages.push("ellipsis-start");
      }
    }

    // Add middle pages
    for (let i = startPage; i <= endPage; i++) {
      if (i !== firstPage && i !== lastPage) {
        pages.push(i);
      }
    }

    // Add last page if not included in range
    if (endPage < lastPage) {
      if (endPage < lastPage - 1) {
        pages.push("ellipsis-end");
      }
      pages.push(lastPage);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className={`flex items-center justify-between ${className || ""}`}>
      <div className="text-sm text-muted-foreground">
        {itemsCount !== undefined && (
          <>
            {t("showing")} {Math.min((currentPage - 1) * itemsPerPage + 1, itemsCount)} - {Math.min(currentPage * itemsPerPage, itemsCount)} {t("of")} {itemsCount}
          </>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">{t("previous")}</span>
        </Button>
        
        {visiblePages.map((page, index) => {
          if (page === "ellipsis-start" || page === "ellipsis-end") {
            return (
              <Button
                key={`ellipsis-${index}`}
                variant="outline"
                size="sm"
                disabled
              >
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">{t("more")}</span>
              </Button>
            );
          }
          
          return (
            <Button
              key={`page-${page}`}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => handlePageChange(page as number)}
            >
              {page}
            </Button>
          );
        })}
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">{t("next")}</span>
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
