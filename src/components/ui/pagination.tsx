
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

export interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  itemsCount?: number;
  itemsPerPage?: number;
  className?: string;
  children?: React.ReactNode;
}

const Pagination: React.FC<PaginationProps> = ({
  totalPages,
  currentPage,
  onPageChange,
  itemsCount,
  itemsPerPage,
  className,
  children
}) => {
  const { t } = useLanguage();
  
  if (totalPages <= 1) return null;
  
  const getPageNumbers = () => {
    const pages = [];
    const showEllipsisBefore = currentPage > 3;
    const showEllipsisAfter = currentPage < totalPages - 2;
    
    if (showEllipsisBefore) {
      pages.push(1);
      pages.push('ellipsis-before');
    }
    
    let startPage = showEllipsisBefore ? Math.max(2, currentPage - 1) : 1;
    let endPage = showEllipsisAfter ? Math.min(totalPages - 1, currentPage + 1) : totalPages;
    
    if (startPage <= 3) startPage = 1;
    if (endPage >= totalPages - 2) endPage = totalPages;
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    if (showEllipsisAfter) {
      pages.push('ellipsis-after');
      pages.push(totalPages);
    }
    
    return pages;
  };

  return (
    <div className={cn("flex items-center justify-between px-2", className)}>
      {children ? children : (
        <div className="flex items-center justify-center flex-1">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="hidden h-8 w-8 p-0 sm:flex"
              aria-label={t("previousPage")}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            {getPageNumbers().map((page, index) => {
              if (page === 'ellipsis-before' || page === 'ellipsis-after') {
                return (
                  <div key={`ellipsis-${index}`} className="flex items-center justify-center h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </div>
                );
              }
              
              return (
                <Button
                  key={`page-${page}`}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPageChange(page as number)}
                  className="h-8 w-8"
                  aria-label={t("goToPage", { page })}
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
              className="hidden h-8 w-8 p-0 sm:flex"
              aria-label={t("nextPage")}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {itemsCount !== undefined && itemsPerPage !== undefined && (
        <div className="text-xs text-muted-foreground">
          {t("showingItems", {
            start: (currentPage - 1) * itemsPerPage + 1,
            end: Math.min(currentPage * itemsPerPage, itemsCount),
            total: itemsCount
          })}
        </div>
      )}
    </div>
  );
};

export const PaginationContent = Pagination;
export const PaginationEllipsis = () => <MoreHorizontal className="h-4 w-4" />;
export const PaginationItem = Button;
export const PaginationLink = Button;
export const PaginationNext = (props: any) => (
  <Button {...props} variant="outline" size="sm" className="h-8 w-8 p-0">
    <ChevronRight className="h-4 w-4" />
  </Button>
);
export const PaginationPrevious = (props: any) => (
  <Button {...props} variant="outline" size="sm" className="h-8 w-8 p-0">
    <ChevronLeft className="h-4 w-4" />
  </Button>
);

export default Pagination;
