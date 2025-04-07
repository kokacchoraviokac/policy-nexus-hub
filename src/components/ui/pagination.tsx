
import React from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  itemsCount?: number;
  itemsPerPage?: number;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  totalPages,
  currentPage,
  onPageChange,
  itemsCount,
  itemsPerPage = 10,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
  className = "",
}) => {
  const { t } = useLanguage();

  const handlePrevClick = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextClick = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handleFirstClick = () => {
    onPageChange(1);
  };

  const handleLastClick = () => {
    onPageChange(totalPages);
  };

  // Helper to create page numbers with ellipses
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      // Show all pages if we have less than maxPagesToShow
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show first page
      pageNumbers.push(1);
      
      // Calculate start and end of the middle section
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      
      // Adjust if we're near the beginning
      if (currentPage <= 3) {
        endPage = 4;
      }
      
      // Adjust if we're near the end
      if (currentPage >= totalPages - 2) {
        startPage = totalPages - 3;
      }
      
      // Add ellipsis if needed before middle section
      if (startPage > 2) {
        pageNumbers.push("ellipsis-start");
      }
      
      // Add middle section
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      
      // Add ellipsis if needed after middle section
      if (endPage < totalPages - 1) {
        pageNumbers.push("ellipsis-end");
      }
      
      // Always show last page
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className={`flex items-center justify-between py-4 ${className}`}>
      <div className="flex-1 text-sm text-muted-foreground">
        {itemsCount !== undefined && (
          <>
            {t("showing")} {Math.min((currentPage - 1) * itemsPerPage + 1, itemsCount)} - {" "}
            {Math.min(currentPage * itemsPerPage, itemsCount)} {t("of")} {itemsCount} {t("items")}
          </>
        )}
      </div>
      
      <div className="flex items-center space-x-2">
        {onPageSizeChange && (
          <div className="flex items-center space-x-2">
            <p className="text-sm text-muted-foreground">{t("rowsPerPage")}</p>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(value) => onPageSizeChange(Number(value))}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={itemsPerPage.toString()} />
              </SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map((option) => (
                  <SelectItem key={option} value={option.toString()}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        
        <div className="flex items-center space-x-1">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={handleFirstClick}
            disabled={currentPage === 1}
          >
            <span className="sr-only">{t("firstPage")}</span>
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={handlePrevClick}
            disabled={currentPage === 1}
          >
            <span className="sr-only">{t("previousPage")}</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          {getPageNumbers().map((page, i) => {
            if (page === "ellipsis-start" || page === "ellipsis-end") {
              return (
                <Button
                  key={`ellipsis-${i}`}
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 pointer-events-none"
                  disabled
                >
                  <span>...</span>
                </Button>
              );
            }
            
            return (
              <Button
                key={`page-${page}`}
                variant={currentPage === page ? "default" : "outline"}
                size="icon"
                className="h-8 w-8"
                onClick={() => onPageChange(page as number)}
              >
                <span>{page}</span>
              </Button>
            );
          })}
          
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={handleNextClick}
            disabled={currentPage === totalPages}
          >
            <span className="sr-only">{t("nextPage")}</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={handleLastClick}
            disabled={currentPage === totalPages}
          >
            <span className="sr-only">{t("lastPage")}</span>
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;

// For backward compatibility with modular pagination components
export const PaginationContent = ({ children }: { children: React.ReactNode }) => <div className="flex items-center space-x-1">{children}</div>;
export const PaginationItem = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
export const PaginationLink = ({ isActive, children, ...props }: { isActive?: boolean; children: React.ReactNode; [key: string]: any }) => (
  <Button variant={isActive ? "default" : "outline"} size="icon" className="h-8 w-8" {...props}>{children}</Button>
);
export const PaginationPrevious = (props: any) => (
  <Button variant="outline" size="icon" className="h-8 w-8" {...props}>
    <ChevronLeft className="h-4 w-4" />
  </Button>
);
export const PaginationNext = (props: any) => (
  <Button variant="outline" size="icon" className="h-8 w-8" {...props}>
    <ChevronRight className="h-4 w-4" />
  </Button>
);
export const PaginationEllipsis = () => (
  <Button variant="outline" size="icon" className="h-8 w-8 pointer-events-none" disabled>
    <span>...</span>
  </Button>
);
