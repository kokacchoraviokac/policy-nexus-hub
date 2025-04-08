
import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PaginationProps } from '@/types/common';

const Pagination: React.FC<PaginationProps> = (props) => {
  // Support both old and new prop names for backward compatibility
  const page = props.page || props.currentPage || 1;
  const totalPages = props.total_pages || props.totalPages || 1;
  const onPageChange = props.onPageChange;
  
  // These props are only used in the old style
  const itemsPerPage = props.itemsPerPage;
  const itemsCount = props.itemsCount;
  
  const hasPrevious = page > 1;
  const hasNext = page < totalPages;
  
  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex items-center">
        {itemsCount && itemsPerPage && (
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-medium">{Math.min((page - 1) * itemsPerPage + 1, itemsCount)}</span> to{' '}
            <span className="font-medium">{Math.min(page * itemsPerPage, itemsCount)}</span> of{' '}
            <span className="font-medium">{itemsCount}</span> items
          </p>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(1)}
          disabled={!hasPrevious}
        >
          <ChevronsLeft className="h-4 w-4" />
          <span className="sr-only">First page</span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(page - 1)}
          disabled={!hasPrevious}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous page</span>
        </Button>
        <span className="text-sm font-medium">
          Page {page} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(page + 1)}
          disabled={!hasNext}
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next page</span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(totalPages)}
          disabled={!hasNext}
        >
          <ChevronsRight className="h-4 w-4" />
          <span className="sr-only">Last page</span>
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
