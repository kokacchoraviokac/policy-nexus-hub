
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Pagination, PaginationProps } from '@/components/ui/pagination';
import { useLanguage } from '@/contexts/LanguageContext';

interface PaginationControllerProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  pageSizeOptions?: number[];
  className?: string;
}

const PaginationController: React.FC<PaginationControllerProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
  className,
}) => {
  const { t } = useLanguage();
  
  // Adapt our props to match the PaginationProps interface
  const paginationProps: PaginationProps = {
    itemsCount: totalItems,
    itemsPerPage: itemsPerPage,
    currentPage: currentPage,
    onPageChange: onPageChange,
    className
  };
  
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2">
      <div className="text-sm text-muted-foreground">
        {t('showing')} {totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}-
        {Math.min(currentPage * itemsPerPage, totalItems)} {t('of')} {totalItems} {t('items')}
      </div>
      
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">{t('rowsPerPage')}</span>
          <Select
            value={itemsPerPage.toString()}
            onValueChange={(value) => onPageSizeChange(Number(value))}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue />
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
        
        <Pagination {...paginationProps} />
      </div>
    </div>
  );
};

export default PaginationController;
