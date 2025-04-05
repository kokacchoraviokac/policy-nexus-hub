
import React from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { cn } from "@/utils/cn";

export interface PaginationProps {
  itemsCount: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  pageSize?: number;
  onPageSizeChange?: (pageSize: number) => void;
  className?: string;
  showPageInfo?: boolean;
}

export const PaginationContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-row items-center gap-1", className)}
    {...props}
  />
));
PaginationContent.displayName = "PaginationContent";

export const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.HTMLAttributes<HTMLLIElement>
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("", className)} {...props} />
));
PaginationItem.displayName = "PaginationItem";

export type PaginationLinkProps = {
  isActive?: boolean;
} & ButtonProps;

export const PaginationLink = React.forwardRef<
  HTMLButtonElement,
  PaginationLinkProps
>(({ className, isActive, size, ...props }, ref) => (
  <Button
    ref={ref}
    variant={isActive ? "default" : "outline"}
    size="icon"
    className={cn(className)}
    {...props}
  />
));
PaginationLink.displayName = "PaginationLink";

export const PaginationPrevious = React.forwardRef<
  HTMLButtonElement,
  PaginationLinkProps
>(({ className, ...props }, ref) => (
  <Button
    ref={ref}
    variant="outline"
    size="icon"
    className={cn("gap-1 pl-2.5", className)}
    {...props}
  >
    <ChevronLeft className="h-4 w-4" />
    <span className="sr-only">Previous</span>
  </Button>
));
PaginationPrevious.displayName = "PaginationPrevious";

export const PaginationNext = React.forwardRef<
  HTMLButtonElement,
  PaginationLinkProps
>(({ className, ...props }, ref) => (
  <Button
    ref={ref}
    variant="outline"
    size="icon"
    className={cn("gap-1 pr-2.5", className)}
    {...props}
  >
    <span className="sr-only">Next</span>
    <ChevronRight className="h-4 w-4" />
  </Button>
));
PaginationNext.displayName = "PaginationNext";

export const PaginationEllipsis = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    <span className="text-muted-foreground">...</span>
  </span>
));
PaginationEllipsis.displayName = "PaginationEllipsis";

export function Pagination({
  itemsCount,
  itemsPerPage,
  currentPage,
  onPageChange,
  pageSize,
  onPageSizeChange,
  className,
  showPageInfo = true,
  ...props
}: PaginationProps & React.HTMLAttributes<HTMLDivElement>) {
  const pageCount = Math.ceil(itemsCount / itemsPerPage);
  
  // Handle cases where itemsCount is 0
  const safePageCount = Math.max(1, pageCount);
  
  // Ensure currentPage is valid
  const safeCurrentPage = Math.min(Math.max(1, currentPage), safePageCount);
  
  // Calculate visible pages
  const visiblePages = [];
  const pagesToShow = 5;
  
  let startPage = Math.max(1, safeCurrentPage - Math.floor(pagesToShow / 2));
  let endPage = Math.min(safePageCount, startPage + pagesToShow - 1);
  
  // Adjust start page if end page is maxed out
  if (endPage === safePageCount) {
    startPage = Math.max(1, endPage - pagesToShow + 1);
  }
  
  for (let i = startPage; i <= endPage; i++) {
    visiblePages.push(i);
  }
  
  return (
    <div className={cn("flex flex-col sm:flex-row items-center gap-4 py-4", className)} {...props}>
      {showPageInfo && pageCount > 0 && (
        <div className="text-sm text-muted-foreground">
          Showing {(safeCurrentPage - 1) * itemsPerPage + 1} to {Math.min(safeCurrentPage * itemsPerPage, itemsCount)} of {itemsCount} entries
        </div>
      )}
      <div className="ml-auto flex items-center gap-1">
        <PaginationLink
          onClick={() => onPageChange(1)}
          disabled={safeCurrentPage === 1}
          aria-label="Go to first page"
        >
          <ChevronsLeft className="h-4 w-4" />
        </PaginationLink>
        <PaginationLink
          onClick={() => onPageChange(safeCurrentPage - 1)}
          disabled={safeCurrentPage === 1}
          aria-label="Go to previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </PaginationLink>
        
        {visiblePages.map((page) => (
          <PaginationLink
            key={page}
            isActive={page === safeCurrentPage}
            onClick={() => onPageChange(page)}
            aria-label={`Page ${page}`}
          >
            {page}
          </PaginationLink>
        ))}
        
        <PaginationLink
          onClick={() => onPageChange(safeCurrentPage + 1)}
          disabled={safeCurrentPage === safePageCount}
          aria-label="Go to next page"
        >
          <ChevronRight className="h-4 w-4" />
        </PaginationLink>
        <PaginationLink
          onClick={() => onPageChange(safePageCount)}
          disabled={safeCurrentPage === safePageCount}
          aria-label="Go to last page"
        >
          <ChevronsRight className="h-4 w-4" />
        </PaginationLink>
      </div>
    </div>
  );
}
