
import React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/utils/shadcn";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsCount?: number;
  itemsPerPage?: number;
  className?: string;
  children?: React.ReactNode;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  itemsCount,
  itemsPerPage,
  className,
  children
}: PaginationProps) {
  // If we have itemsCount and itemsPerPage but no totalPages, calculate totalPages
  const calculatedTotalPages = totalPages || (itemsCount && itemsPerPage ? Math.ceil(itemsCount / itemsPerPage) : 0);
  
  // Use either the provided totalPages or the calculated value
  const pages = calculatedTotalPages;

  const renderPageNumbers = () => {
    const pageNumbers = [];
    
    // Always show the first page
    pageNumbers.push(
      <PaginationItem key={1} isActive={currentPage === 1} onClick={() => onPageChange(1)}>
        1
      </PaginationItem>
    );

    // If there are more than 7 pages, show dots
    if (pages > 7) {
      // Show dots after page 1 if current page is > 3
      if (currentPage > 3) {
        pageNumbers.push(
          <PaginationEllipsis key="ellipsis-1" />
        );
      }

      // Show pages around current page
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(pages - 1, currentPage + 1);

      if (currentPage <= 3) {
        endPage = Math.min(5, pages - 1);
      }

      if (currentPage >= pages - 2) {
        startPage = Math.max(2, pages - 4);
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(
          <PaginationItem key={i} isActive={currentPage === i} onClick={() => onPageChange(i)}>
            {i}
          </PaginationItem>
        );
      }

      // Show dots before last page if current page is < pages - 2
      if (currentPage < pages - 2) {
        pageNumbers.push(
          <PaginationEllipsis key="ellipsis-2" />
        );
      }
    } else {
      // Show all pages if there are 7 or fewer
      for (let i = 2; i < pages; i++) {
        pageNumbers.push(
          <PaginationItem key={i} isActive={currentPage === i} onClick={() => onPageChange(i)}>
            {i}
          </PaginationItem>
        );
      }
    }

    // Always show the last page if there is more than 1 page
    if (pages > 1) {
      pageNumbers.push(
        <PaginationItem key={pages} isActive={currentPage === pages} onClick={() => onPageChange(pages)}>
          {pages}
        </PaginationItem>
      );
    }

    return pageNumbers;
  };

  if (pages <= 1) {
    return null;
  }

  return (
    <nav
      role="navigation"
      aria-label="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
    >
      <ul className="flex flex-row items-center gap-1">
        <PaginationPrevious 
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        />
        {renderPageNumbers()}
        <PaginationNext 
          onClick={() => onPageChange(Math.min(pages, currentPage + 1))}
          disabled={currentPage >= pages}
        />
      </ul>
      {children}
    </nav>
  );
}

export const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("flex flex-row items-center gap-1", className)}
    {...props}
  />
));
PaginationContent.displayName = "PaginationContent";

export const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li"> & { 
    isActive?: boolean;
    onClick?: () => void;
  }
>(({ className, isActive, onClick, ...props }, ref) => (
  <li ref={ref} className={cn("", className)}>
    <Button
      variant={isActive ? "default" : "outline"}
      size="icon"
      className={cn("w-9 h-9", className)}
      onClick={onClick}
      {...props}
    />
  </li>
));
PaginationItem.displayName = "PaginationItem";

export const PaginationLink = ({
  className,
  isActive,
  children,
  ...props
}: React.ComponentPropsWithoutRef<"a"> & {
  isActive?: boolean;
}) => (
  <PaginationItem isActive={isActive}>
    <a
      aria-current={isActive ? "page" : undefined}
      className={cn("flex h-9 w-9 items-center justify-center rounded-md", className)}
      {...props}
    >
      {children}
    </a>
  </PaginationItem>
);
PaginationLink.displayName = "PaginationLink";

export const PaginationPrevious = ({
  className,
  onClick,
  disabled,
  ...props
}: React.ComponentProps<typeof PaginationItem> & {
  disabled?: boolean;
}) => (
  <PaginationItem
    aria-disabled={disabled}
    className={cn("", className)}
    onClick={!disabled ? onClick : undefined}
    {...props}
  >
    <ChevronLeft className="h-4 w-4" />
  </PaginationItem>
);
PaginationPrevious.displayName = "PaginationPrevious";

export const PaginationNext = ({
  className,
  onClick,
  disabled,
  ...props
}: React.ComponentProps<typeof PaginationItem> & {
  disabled?: boolean;
}) => (
  <PaginationItem
    aria-disabled={disabled}
    className={cn("", className)}
    onClick={!disabled ? onClick : undefined}
    {...props}
  >
    <ChevronRight className="h-4 w-4" />
  </PaginationItem>
);
PaginationNext.displayName = "PaginationNext";

export const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"li">) => (
  <li
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </li>
);
PaginationEllipsis.displayName = "PaginationEllipsis";
