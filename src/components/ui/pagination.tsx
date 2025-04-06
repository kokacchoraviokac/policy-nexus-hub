
import React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/utils/shadcn";
import { Button } from "./button";

export interface PaginationProps {
  itemsCount: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  totalPages?: number; // Make optional and calculate if not provided
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  itemsCount,
  itemsPerPage,
  currentPage,
  onPageChange,
  totalPages: propsTotalPages,
  className,
}) => {
  // Calculate total pages if not provided
  const totalPages = propsTotalPages || Math.ceil(itemsCount / itemsPerPage);
  
  if (totalPages <= 1) return null;

  const showEllipsisStart = totalPages > 5 && currentPage > 3;
  const showEllipsisEnd = totalPages > 5 && currentPage < totalPages - 2;

  const getPageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 3) {
      return [1, 2, 3, 4, 5];
    }

    if (currentPage >= totalPages - 2) {
      return [
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [
      currentPage - 1,
      currentPage,
      currentPage + 1,
    ];
  };

  const pageNumbers = getPageNumbers();

  const goToPage = (page: number) => {
    if (page !== currentPage && page > 0 && page <= totalPages) {
      onPageChange(page);
    }
  };

  return (
    <nav
      className={cn("flex items-center justify-center space-x-1", className)}
      aria-label="Pagination"
    >
      <Button
        variant="outline"
        size="icon"
        className={cn("h-8 w-8", { "opacity-50 cursor-not-allowed": currentPage === 1 })}
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {/* First page */}
      {showEllipsisStart && (
        <>
          <PaginationLink
            page={1}
            isActive={currentPage === 1}
            onClick={() => goToPage(1)}
          />
          <PaginationEllipsis />
        </>
      )}

      {/* Page numbers */}
      {pageNumbers.map((page) => (
        <PaginationLink
          key={page}
          page={page}
          isActive={currentPage === page}
          onClick={() => goToPage(page)}
        />
      ))}

      {/* Last page */}
      {showEllipsisEnd && (
        <>
          <PaginationEllipsis />
          <PaginationLink
            page={totalPages}
            isActive={currentPage === totalPages}
            onClick={() => goToPage(totalPages)}
          />
        </>
      )}

      <Button
        variant="outline"
        size="icon"
        className={cn("h-8 w-8", { "opacity-50 cursor-not-allowed": currentPage === totalPages })}
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </nav>
  );
};

export const PaginationLink: React.FC<{
  page: number;
  isActive?: boolean;
  onClick: () => void;
}> = ({ page, isActive = false, onClick }) => (
  <Button
    variant={isActive ? "default" : "outline"}
    size="icon"
    className="h-8 w-8"
    onClick={onClick}
  >
    {page}
  </Button>
);

export const PaginationEllipsis: React.FC = () => (
  <div className="flex h-8 w-8 items-center justify-center">
    <MoreHorizontal className="h-4 w-4" />
  </div>
);

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
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("", className)} {...props} />
));
PaginationItem.displayName = "PaginationItem";

export const PaginationPrevious = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationItem>
    <PaginationLink
      aria-label="Go to previous page"
      size="default"
      className={cn("gap-1 pl-2.5", className)}
      {...props}
    >
      <ChevronLeft className="h-4 w-4" />
      <span>Previous</span>
    </PaginationLink>
  </PaginationItem>
);

export const PaginationNext = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationItem>
    <PaginationLink
      aria-label="Go to next page"
      size="default"
      className={cn("gap-1 pr-2.5", className)}
      {...props}
    >
      <span>Next</span>
      <ChevronRight className="h-4 w-4" />
    </PaginationLink>
  </PaginationItem>
);

export { Pagination };
