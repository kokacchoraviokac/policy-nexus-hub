
import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";

export interface PaginationControllerProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  pageSizeOptions?: number[];
  showPageSize?: boolean;
  showingText?: string;
  ofText?: string;
  itemsText?: string;
  nextText?: string;
  previousText?: string;
  pageText?: string;
  pageXOfYText?: string;
  rowsPerPageText?: string;
  goToText?: string;
}

const PaginationController: React.FC<PaginationControllerProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
  showPageSize = true,
  showingText,
  ofText,
  itemsText,
  nextText,
  previousText,
  pageText,
  pageXOfYText,
  rowsPerPageText,
  goToText,
}) => {
  const { t } = useLanguage();
  
  // Use provided text or fallback to translations
  const localizedShowingText = showingText || t('showingItemsOf');
  const localizedOfText = ofText || t('of');
  const localizedItemsText = itemsText || t('items');
  const localizedNextText = nextText || t('next');
  const localizedPreviousText = previousText || t('previous');
  const localizedPageText = pageText || t('page');
  const localizedPageXOfYText = pageXOfYText || t('pageXOfY');
  const localizedRowsPerPageText = rowsPerPageText || t('rowsPerPage');
  const localizedGoToText = goToText || t('goTo');
  
  // Calculate start and end items on current page
  const startItem = totalItems === 0 ? 0 : (currentPage * itemsPerPage) + 1;
  const endItem = Math.min((currentPage + 1) * itemsPerPage, totalItems);
  
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    
    if (totalPages <= 7) {
      // If fewer than 7 pages, show all
      for (let i = 0; i < totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always include first page
      pages.push(0);
      
      // Add ellipsis or additional pages
      if (currentPage > 2) {
        pages.push("ellipsis-start");
      }
      
      // Pages around current page
      let startPage = Math.max(1, currentPage - 1);
      let endPage = Math.min(totalPages - 2, currentPage + 1);
      
      // Adjust if at the beginning
      if (currentPage <= 2) {
        endPage = 3;
      }
      
      // Adjust if at the end
      if (currentPage >= totalPages - 3) {
        startPage = totalPages - 4;
      }
      
      // Add the pages around current page
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      // Add ellipsis or additional pages
      if (currentPage < totalPages - 3) {
        pages.push("ellipsis-end");
      }
      
      // Always include last page
      pages.push(totalPages - 1);
    }
    
    return pages;
  };
  
  const pageNumbers = getPageNumbers();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0 py-2">
      <div className="text-sm text-muted-foreground">
        {totalItems > 0 
          ? localizedShowingText
            .replace('{0}', startItem.toString())
            .replace('{1}', endItem.toString())
            .replace('{2}', totalItems.toString())
          : t('noItemsToShow')
        }
      </div>
      
      <div className="flex items-center space-x-6">
        {showPageSize && (
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">{localizedRowsPerPageText}:</span>
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
        
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => onPageChange(Math.max(0, currentPage - 1))}
                aria-disabled={currentPage === 0}
                className={currentPage === 0 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            
            {pageNumbers.map((page, index) => (
              <PaginationItem key={`${page}-${index}`}>
                {page === "ellipsis-start" || page === "ellipsis-end" ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    isActive={page === currentPage}
                    onClick={() => onPageChange(page as number)}
                  >
                    {(page as number) + 1}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => onPageChange(Math.min(totalPages - 1, currentPage + 1))}
                aria-disabled={currentPage === totalPages - 1}
                className={currentPage === totalPages - 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default PaginationController;
