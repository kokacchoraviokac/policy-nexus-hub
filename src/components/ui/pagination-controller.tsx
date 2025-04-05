
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { PaginationProps } from "@/types/reports";

export const PaginationController: React.FC<PaginationProps> = ({
  itemsCount,
  itemsPerPage,
  currentPage,
  onPageChange
}) => {
  const totalPages = Math.ceil(itemsCount / itemsPerPage);
  
  if (itemsCount === 0 || totalPages <= 1) {
    return null;
  }
  
  // Generate array of page numbers to show
  const getPageNumbers = () => {
    const pageNumbers: (number | string)[] = [];
    
    // Always show first page
    pageNumbers.push(1);
    
    // If we're far enough from the start, add ellipsis
    if (currentPage > 3) {
      pageNumbers.push("...");
    }
    
    // Add pages around current page
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pageNumbers.push(i);
    }
    
    // If we're far enough from the end, add ellipsis
    if (currentPage < totalPages - 2) {
      pageNumbers.push("...");
    }
    
    // Always show last page if it's not the first page
    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };
  
  return (
    <div className="flex items-center justify-center space-x-2 py-4">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeftIcon className="h-4 w-4" />
      </Button>
      
      {getPageNumbers().map((pageNumber, index) => {
        if (pageNumber === "...") {
          return (
            <span key={`ellipsis-${index}`} className="px-2">
              ...
            </span>
          );
        }
        
        const page = Number(pageNumber);
        return (
          <PaginationButton
            key={`page-${page}`}
            isActive={currentPage === page}
            onClick={() => onPageChange(page)}
          >
            {page}
          </PaginationButton>
        );
      })}
      
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRightIcon className="h-4 w-4" />
      </Button>
    </div>
  );
};

interface PaginationButtonProps {
  children: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}

const PaginationButton: React.FC<PaginationButtonProps> = ({
  children,
  isActive,
  onClick
}) => {
  return (
    <Button
      variant={isActive ? "default" : "outline"}
      size="sm"
      className="h-8 w-8"
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
    >
      {children}
    </Button>
  );
};
