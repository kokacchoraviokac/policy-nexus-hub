
import React from "react";
import { cn } from "@/utils/shadcn";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Button } from "./button";

export interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  itemsCount: number;
  itemsPerPage: number;
}

export interface PaginationItemProps {
  page: number;
  onClick: (page: number) => void;
  isActive?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}

export const PaginationItem: React.FC<PaginationItemProps> = ({
  page,
  onClick,
  isActive,
  disabled,
  children
}) => {
  return (
    <Button
      variant={isActive ? "default" : "outline"}
      size="sm"
      className={cn(
        "h-9 w-9 p-0",
        isActive && "bg-primary text-primary-foreground",
        !isActive && "hover:bg-muted"
      )}
      onClick={() => onClick(page)}
      disabled={disabled}
    >
      {children}
    </Button>
  );
};

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

export const PaginationLink = ({
  className,
  ...props
}: React.ComponentProps<"a">) => (
  <a
    className={cn(
      "hover:text-accent-foreground flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background text-sm font-medium transition-colors hover:bg-accent",
      className
    )}
    {...props}
  />
);
PaginationLink.displayName = "PaginationLink";

export const PaginationNext = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to next page"
    size="default"
    className={cn("gap-1", className)}
    {...props}
  >
    <ChevronRight className="h-4 w-4" />
  </PaginationLink>
);
PaginationNext.displayName = "PaginationNext";

export const PaginationPrevious = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to previous page"
    size="default"
    className={cn("gap-1", className)}
    {...props}
  >
    <ChevronLeft className="h-4 w-4" />
  </PaginationLink>
);
PaginationPrevious.displayName = "PaginationPrevious";

export const Pagination: React.FC<PaginationProps> = ({
  totalPages,
  currentPage,
  onPageChange,
  itemsCount,
  itemsPerPage
}) => {
  // Calculate visible page numbers
  const getVisiblePageNumbers = () => {
    const delta = 2; // How many pages to show on each side of current page
    const pages = [];
    
    // Always show first page
    pages.push(1);
    
    // Calculate range
    let left = Math.max(2, currentPage - delta);
    let right = Math.min(totalPages - 1, currentPage + delta);
    
    // Adjust to show more pages on one side if the other side has less
    if (currentPage - delta > 2) {
      pages.push(null); // null represents ellipsis
    }
    
    // Add middle pages
    for (let i = left; i <= right; i++) {
      pages.push(i);
    }
    
    // Add ellipsis if needed
    if (right < totalPages - 1) {
      pages.push(null);
    }
    
    // Always show last page if there is more than one page
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    
    return pages;
  };

  // If there's only 1 page, don't show pagination
  if (totalPages <= 1) {
    return null;
  }

  const visiblePages = getVisiblePageNumbers();
  
  return (
    <nav className="mx-auto flex w-full justify-center">
      <PaginationContent>
        <li>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="h-9 w-9"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous page</span>
          </Button>
        </li>
        
        {visiblePages.map((page, i) => {
          if (page === null) {
            return <PaginationEllipsis key={`ellipsis-${i}`} />;
          }
          
          return (
            <li key={page}>
              <Button
                variant={currentPage === page ? "default" : "outline"}
                size="icon"
                onClick={() => onPageChange(page as number)}
                className="h-9 w-9"
              >
                {page}
              </Button>
            </li>
          );
        })}
        
        <li>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="h-9 w-9"
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next page</span>
          </Button>
        </li>
      </PaginationContent>
    </nav>
  );
};

export default Pagination;
