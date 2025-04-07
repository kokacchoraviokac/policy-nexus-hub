
import React from "react";
import { cn } from "@/utils/shadcn";
import { Pagination } from "./pagination";

export interface PaginationControllerProps {
  itemsCount: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  className?: string;
}

/**
 * A controller component that handles pagination logic and renders a Pagination component
 * with the correct props. This abstraction is useful for components that need pagination
 * but don't want to deal with calculating total pages.
 */
const PaginationController: React.FC<PaginationControllerProps> = ({
  itemsCount,
  itemsPerPage,
  currentPage,
  onPageChange,
  className,
}) => {
  // Calculate total pages
  const totalPages = Math.max(1, Math.ceil(itemsCount / itemsPerPage));

  // If there's only 1 page, don't show pagination
  if (totalPages <= 1) {
    return null;
  }

  // Make sure current page is within bounds
  const boundedCurrentPage = Math.max(1, Math.min(currentPage, totalPages));
  
  // If current page is out of bounds, auto-correct by changing page
  if (boundedCurrentPage !== currentPage) {
    onPageChange(boundedCurrentPage);
  }

  return (
    <div className={cn("flex items-center justify-center pt-4", className)}>
      <Pagination
        totalPages={totalPages}
        currentPage={boundedCurrentPage}
        onPageChange={onPageChange}
        itemsCount={itemsCount}
        itemsPerPage={itemsPerPage}
      />
    </div>
  );
};

export default PaginationController;
