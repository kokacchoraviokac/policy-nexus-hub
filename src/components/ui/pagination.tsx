
import React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage?: number;
  itemsCount?: number;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  itemsCount,
}) => {
  const { t } = useLanguage();

  const renderPageNumbers = () => {
    const pages = [];

    // Always include first page
    pages.push(
      <Button 
        key={1} 
        variant={currentPage === 1 ? "default" : "outline"} 
        size="icon" 
        className="h-8 w-8" 
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
      >
        1
      </Button>
    );

    if (currentPage > 3) {
      pages.push(
        <Button 
          key="start-ellipsis" 
          variant="outline" 
          size="icon" 
          className="h-8 w-8" 
          disabled
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      );
    }

    // Pages around current page
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (i === 1 || i === totalPages) continue; // Skip first and last page as they're always shown
      pages.push(
        <Button 
          key={i} 
          variant={currentPage === i ? "default" : "outline"} 
          size="icon" 
          className="h-8 w-8" 
          onClick={() => onPageChange(i)}
        >
          {i}
        </Button>
      );
    }

    if (currentPage < totalPages - 2) {
      pages.push(
        <Button 
          key="end-ellipsis" 
          variant="outline" 
          size="icon" 
          className="h-8 w-8" 
          disabled
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      );
    }

    // Always include last page if there is more than one page
    if (totalPages > 1) {
      pages.push(
        <Button 
          key={totalPages} 
          variant={currentPage === totalPages ? "default" : "outline"} 
          size="icon" 
          className="h-8 w-8" 
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
        >
          {totalPages}
        </Button>
      );
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between">
      {itemsCount && itemsPerPage && (
        <div className="text-sm text-muted-foreground">
          {t("showingXtoYofZ", {
            start: ((currentPage - 1) * itemsPerPage) + 1,
            end: Math.min(currentPage * itemsPerPage, itemsCount),
            total: itemsCount
          })}
        </div>
      )}
      
      <div className="flex items-center space-x-2">
        <Button 
          variant="outline" 
          size="icon" 
          className="h-8 w-8" 
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div className="flex items-center">
          {renderPageNumbers()}
        </div>
        
        <Button 
          variant="outline" 
          size="icon" 
          className="h-8 w-8" 
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export interface PaginationControllerProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  itemsCount: number;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
}

export const PaginationController: React.FC<PaginationControllerProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  itemsCount,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100]
}) => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        {onPageSizeChange && (
          <>
            <span className="text-sm whitespace-nowrap">{t("rowsPerPage")}:</span>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(value) => onPageSizeChange(parseInt(value))}
            >
              <SelectTrigger className="h-8 w-20">
                <SelectValue placeholder={itemsPerPage.toString()} />
              </SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map((size) => (
                  <SelectItem key={size} value={size.toString()}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </>
        )}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        itemsPerPage={itemsPerPage}
        itemsCount={itemsCount}
      />
    </div>
  );
};

export default Pagination;
