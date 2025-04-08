
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

export interface PaginationProps {
  page: number;                        // Current page (starting from 1)
  total_pages: number;                 // Total number of pages
  onPageChange: (page: number) => void; // Page change callback
  total_items?: number;                // Total number of items
  page_size?: number;                  // Items per page

  // Backward compatibility aliases
  currentPage?: number;                // Alias for page
  totalPages?: number;                 // Alias for total_pages
  itemsCount?: number;                 // Alias for total_items
  itemsPerPage?: number;               // Alias for page_size
}

const Pagination: React.FC<PaginationProps> = ({
  page,
  total_pages,
  onPageChange,
  total_items,
  page_size,
  // Backward compatibility
  currentPage,
  totalPages,
  itemsCount,
  itemsPerPage
}) => {
  // Use the aliased props if the main ones are not provided
  const currentPageNumber = page || currentPage || 1;
  const totalPagesNumber = total_pages || totalPages || 1;
  const itemsPerPageNumber = page_size || itemsPerPage;
  const totalItemsNumber = total_items || itemsCount;

  // Don't render pagination if there's only one page
  if (totalPagesNumber <= 1) return null;

  // Determine which page numbers to display
  const getPageNumbers = () => {
    const pageNumbers: (number | 'ellipsis')[] = [];
    
    if (totalPagesNumber <= 7) {
      // If we have 7 or fewer pages, show all page numbers
      for (let i = 1; i <= totalPagesNumber; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show first page
      pageNumbers.push(1);
      
      // Show ellipsis if not close to the beginning
      if (currentPageNumber > 3) {
        pageNumbers.push('ellipsis');
      }
      
      // Determine start and end of the middle section
      let startPage = Math.max(2, currentPageNumber - 1);
      let endPage = Math.min(totalPagesNumber - 1, currentPageNumber + 1);
      
      // Adjust if close to the beginning
      if (currentPageNumber <= 3) {
        endPage = 4;
      }
      
      // Adjust if close to the end
      if (currentPageNumber >= totalPagesNumber - 2) {
        startPage = totalPagesNumber - 3;
      }
      
      // Add the middle section
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      
      // Show ellipsis if not close to the end
      if (currentPageNumber < totalPagesNumber - 2) {
        pageNumbers.push('ellipsis');
      }
      
      // Always show the last page
      pageNumbers.push(totalPagesNumber);
    }
    
    return pageNumbers;
  };

  const pageNumbers = getPageNumbers();

  // Create item counter text (e.g., "1-10 of 50 items")
  const getItemCountText = () => {
    if (!totalItemsNumber) return null;
    
    const start = (currentPageNumber - 1) * (itemsPerPageNumber || 10) + 1;
    const end = Math.min(currentPageNumber * (itemsPerPageNumber || 10), totalItemsNumber);
    
    return (
      <div className="text-sm text-muted-foreground">
        {start}-{end} of {totalItemsNumber} items
      </div>
    );
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0 py-4">
      {getItemCountText()}
      
      <div className="flex items-center space-x-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPageNumber - 1)}
          disabled={currentPageNumber === 1}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous Page</span>
        </Button>
        
        {pageNumbers.map((pageNumber, index) => {
          if (pageNumber === 'ellipsis') {
            return (
              <Button
                key={`ellipsis-${index}`}
                variant="outline"
                size="sm"
                disabled
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            );
          }
          
          return (
            <Button
              key={pageNumber}
              variant={pageNumber === currentPageNumber ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(pageNumber)}
            >
              {pageNumber}
            </Button>
          );
        })}
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPageNumber + 1)}
          disabled={currentPageNumber === totalPagesNumber}
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next Page</span>
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
