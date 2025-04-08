
import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PaginationControllerProps } from '@/types/common';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';

export const PaginationController: React.FC<PaginationControllerProps> = ({
  currentPage,
  totalPages,
  itemsPerPage,
  itemsCount,
  totalItems,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
}) => {
  const { t } = useLanguage();
  
  const handlePageSizeChange = (value: string) => {
    if (onPageSizeChange) {
      onPageSizeChange(Number(value));
    }
  };

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages || totalPages === 0;
  
  // Show at most 7 page buttons (including first, last, and ellipses)
  const getPageButtons = () => {
    const buttons = [];
    
    if (totalPages <= 7) {
      // If we have 7 or fewer pages, show all of them
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(
          <Button
            key={i}
            variant={currentPage === i ? 'default' : 'outline'}
            size="icon"
            onClick={() => onPageChange(i)}
            className="h-8 w-8"
          >
            {i}
          </Button>
        );
      }
    } else {
      // Always show first page
      buttons.push(
        <Button
          key={1}
          variant={currentPage === 1 ? 'default' : 'outline'}
          size="icon"
          onClick={() => onPageChange(1)}
          className="h-8 w-8"
        >
          1
        </Button>
      );
      
      // Logic for showing ellipses and middle pages
      if (currentPage <= 3) {
        // If we're near the start, show the first 5 pages
        for (let i = 2; i <= 5; i++) {
          buttons.push(
            <Button
              key={i}
              variant={currentPage === i ? 'default' : 'outline'}
              size="icon"
              onClick={() => onPageChange(i)}
              className="h-8 w-8"
            >
              {i}
            </Button>
          );
        }
        buttons.push(
          <Button key="ellipsis1" variant="outline" size="icon" disabled className="h-8 w-8">
            ...
          </Button>
        );
      } else if (currentPage >= totalPages - 2) {
        // If we're near the end, show the last 5 pages
        buttons.push(
          <Button key="ellipsis1" variant="outline" size="icon" disabled className="h-8 w-8">
            ...
          </Button>
        );
        for (let i = totalPages - 4; i < totalPages; i++) {
          buttons.push(
            <Button
              key={i}
              variant={currentPage === i ? 'default' : 'outline'}
              size="icon"
              onClick={() => onPageChange(i)}
              className="h-8 w-8"
            >
              {i}
            </Button>
          );
        }
      } else {
        // We're in the middle, show current page and siblings
        buttons.push(
          <Button key="ellipsis1" variant="outline" size="icon" disabled className="h-8 w-8">
            ...
          </Button>
        );
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          buttons.push(
            <Button
              key={i}
              variant={currentPage === i ? 'default' : 'outline'}
              size="icon"
              onClick={() => onPageChange(i)}
              className="h-8 w-8"
            >
              {i}
            </Button>
          );
        }
        buttons.push(
          <Button key="ellipsis2" variant="outline" size="icon" disabled className="h-8 w-8">
            ...
          </Button>
        );
      }
      
      // Always show last page
      buttons.push(
        <Button
          key={totalPages}
          variant={currentPage === totalPages ? 'default' : 'outline'}
          size="icon"
          onClick={() => onPageChange(totalPages)}
          className="h-8 w-8"
        >
          {totalPages}
        </Button>
      );
    }
    
    return buttons;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
      <div className="text-sm text-muted-foreground">
        {totalItems !== undefined ? (
          t('showingCountOfTotal', {
            count: itemsCount,
            total: totalItems,
          })
        ) : (
          t('itemsPerPage', { count: itemsCount })
        )}
      </div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        {onPageSizeChange && (
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">{t('rowsPerPage')}</p>
            <Select
              value={String(itemsPerPage)}
              onValueChange={handlePageSizeChange}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={itemsPerPage} />
              </SelectTrigger>
              <SelectContent side="top">
                {pageSizeOptions.map((pageSize) => (
                  <SelectItem key={pageSize} value={String(pageSize)}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(1)}
            disabled={isFirstPage}
            className="hidden sm:flex h-8 w-8"
          >
            <ChevronsLeft className="h-4 w-4" />
            <span className="sr-only">{t('firstPage')}</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={isFirstPage}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">{t('previousPage')}</span>
          </Button>
          
          <div className="flex items-center space-x-1">
            {getPageButtons()}
          </div>
          
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={isLastPage}
            className="h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">{t('nextPage')}</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(totalPages)}
            disabled={isLastPage}
            className="hidden sm:flex h-8 w-8"
          >
            <ChevronsRight className="h-4 w-4" />
            <span className="sr-only">{t('lastPage')}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaginationController;
