
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { 
  ChevronLeft,
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight
} from 'lucide-react';
import { Pagination } from '@/components/ui/pagination';

interface UnlinkedPaymentsPaginationProps {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (newPage: number) => void;
  onPageSizeChange: (newPageSize: number) => void;
}

const UnlinkedPaymentsPagination: React.FC<UnlinkedPaymentsPaginationProps> = ({
  currentPage,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange
}) => {
  const { t } = useLanguage();
  
  // Calculate total pages
  const totalPages = Math.ceil(totalItems / pageSize);
  
  // Handle edge cases
  const safeCurrentPage = Math.min(Math.max(1, currentPage), Math.max(1, totalPages));
  
  return (
    <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 py-4">
      <div className="text-sm text-muted-foreground">
        {totalItems > 0 ? (
          <>
            {t('showing')} 
            <strong> {(safeCurrentPage - 1) * pageSize + 1} </strong>
            {t('to')} 
            <strong> {Math.min(safeCurrentPage * pageSize, totalItems)} </strong>
            {t('of')} 
            <strong> {totalItems} </strong>
            {t('entries')}
          </>
        ) : (
          t('noRecordsToShow')
        )}
      </div>
      
      <div className="flex items-center space-x-2">
        <Pagination
          itemsCount={totalItems}
          itemsPerPage={pageSize}
          currentPage={safeCurrentPage}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
};

export default UnlinkedPaymentsPagination;
