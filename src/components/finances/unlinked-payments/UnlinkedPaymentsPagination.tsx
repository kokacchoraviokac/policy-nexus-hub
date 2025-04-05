
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { 
  Pagination, 
  PaginationLink, 
  PaginationItem, 
  PaginationContent,
  PaginationPrevious, 
  PaginationNext, 
  PaginationEllipsis 
} from "@/components/ui/pagination";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const UnlinkedPaymentsPagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange
}) => {
  // Don't render pagination if there's only one page
  if (totalPages <= 1) {
    return null;
  }

  // Calculate page range to show
  const getPageRange = () => {
    const delta = 1; // Number of pages to show before and after current page
    const range: number[] = [];
    
    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }
    
    // Add first page if not already in range
    if (range[0] > 2) {
      range.unshift(-1); // -1 indicates ellipsis
    }
    if (range[0] !== 2 && range[0] !== -1) {
      range.unshift(2);
    }
    
    // Add last page if not already in range
    if (range[range.length - 1] < totalPages - 1) {
      range.push(-1); // -1 indicates ellipsis
    }
    if (range[range.length - 1] !== totalPages - 1 && range[range.length - 1] !== -1) {
      range.push(totalPages - 1);
    }
    
    return [1, ...range, totalPages];
  };
  
  // Ensure totalPages is at least 1
  const pageCount = Math.max(1, totalPages);
  const pageRange = totalPages > 1 ? getPageRange() : [1];
  
  return (
    <Pagination 
      itemsCount={totalPages * 10} 
      itemsPerPage={10} 
      currentPage={currentPage} 
      onPageChange={onPageChange}
    >
      <PaginationContent>
        {currentPage > 1 && (
          <PaginationItem>
            <PaginationPrevious 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                onPageChange(currentPage - 1);
              }} 
            />
          </PaginationItem>
        )}
        
        {pageRange.map((page, index) => {
          if (page === -1) {
            return (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }
          
          return (
            <PaginationItem key={page}>
              <PaginationLink
                href="#"
                isActive={page === currentPage}
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(page);
                }}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          );
        })}
        
        {currentPage < pageCount && (
          <PaginationItem>
            <PaginationNext 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                onPageChange(currentPage + 1);
              }} 
            />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
};

export default UnlinkedPaymentsPagination;
