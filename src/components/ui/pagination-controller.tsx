
import React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Button } from "./button";
import { PaginationProps } from "@/types/reports";

export const PaginationController: React.FC<PaginationProps> = ({
  itemsCount,
  itemsPerPage,
  currentPage,
  onPageChange,
  pageSize = 10,
  onPageSizeChange,
  children
}) => {
  const totalPages = Math.max(1, Math.ceil(itemsCount / itemsPerPage));
  
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };
  
  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };
  
  const renderPageNumbers = () => {
    const pageNumbers = [];
    
    // Always show the first page
    pageNumbers.push(
      <Button
        key={1}
        variant={currentPage === 1 ? "default" : "outline"}
        className="h-8 w-8 p-0"
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
      >
        1
      </Button>
    );
    
    // Logic for ellipsis and other page numbers
    if (totalPages > 1) {
      // Show ellipsis if needed
      if (currentPage > 3) {
        pageNumbers.push(
          <span 
            key="ellipsis-left"
            className="flex h-8 w-8 items-center justify-center text-muted-foreground"
          >
            <MoreHorizontal className="h-4 w-4" />
          </span>
        );
      }
      
      // Show pages around current page
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(currentPage + 1, totalPages - 1); i++) {
        pageNumbers.push(
          <Button
            key={i}
            variant={currentPage === i ? "default" : "outline"}
            className="h-8 w-8 p-0"
            onClick={() => onPageChange(i)}
            disabled={currentPage === i}
          >
            {i}
          </Button>
        );
      }
      
      // Show ellipsis if needed
      if (currentPage < totalPages - 2) {
        pageNumbers.push(
          <span 
            key="ellipsis-right"
            className="flex h-8 w-8 items-center justify-center text-muted-foreground"
          >
            <MoreHorizontal className="h-4 w-4" />
          </span>
        );
      }
      
      // Show the last page
      if (totalPages > 1) {
        pageNumbers.push(
          <Button
            key={totalPages}
            variant={currentPage === totalPages ? "default" : "outline"}
            className="h-8 w-8 p-0"
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
          >
            {totalPages}
          </Button>
        );
      }
    }
    
    return pageNumbers;
  };
  
  return (
    <div className="flex flex-col items-center justify-between space-y-4 py-4 sm:flex-row sm:space-y-0">
      {/* Items per page selector */}
      {onPageSizeChange && (
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <span>Show</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="h-8 rounded-md border border-input bg-background px-2 py-1 text-sm"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span>per page</span>
        </div>
      )}
      
      {/* Pagination controls */}
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={handlePrevious}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous page</span>
        </Button>
        
        <div className="flex items-center space-x-1">
          {renderPageNumbers()}
        </div>
        
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={handleNext}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next page</span>
        </Button>
      </div>
      
      {/* Total items */}
      <div className="text-sm text-muted-foreground">
        Showing {Math.min((currentPage - 1) * itemsPerPage + 1, itemsCount)} to{" "}
        {Math.min(currentPage * itemsPerPage, itemsCount)} of {itemsCount} items
      </div>
      
      {children}
    </div>
  );
};

export default PaginationController;
