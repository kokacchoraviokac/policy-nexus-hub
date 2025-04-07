
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  showControls?: boolean;
  showEdges?: boolean;
  siblingCount?: number;
  itemsPerPage?: number;
  totalItems?: number;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  itemsCount?: number;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
  showControls = true,
  showEdges = true,
  siblingCount = 1,
  itemsPerPage,
  totalItems,
  onPageSizeChange,
  pageSizeOptions,
  itemsCount
}: PaginationProps) {
  const { t } = useLanguage();
  
  // If there's only 1 page or less, don't show pagination
  if (totalPages <= 1) return null;

  // Generate the range of pages to display
  const generatePages = () => {
    const pages: (number | "dots")[] = [];
    
    // Add first page
    if (showEdges) {
      pages.push(1);
      if (currentPage > 2 + siblingCount) {
        pages.push("dots");
      }
    }
    
    // Add sibling pages
    for (let i = Math.max(2, currentPage - siblingCount); i <= Math.min(totalPages - 1, currentPage + siblingCount); i++) {
      pages.push(i);
    }
    
    // Add last page
    if (showEdges) {
      if (currentPage < totalPages - 1 - siblingCount) {
        pages.push("dots");
      }
      pages.push(totalPages);
    }
    
    return pages;
  };

  const pages = generatePages();

  return (
    <div className={cn("flex flex-col sm:flex-row items-center justify-between gap-4", className)}>
      <div className="text-sm text-muted-foreground">
        {totalItems && itemsPerPage && (
          <>
            {t("showing")} {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} {t("to")}{" "}
            {Math.min(currentPage * itemsPerPage, totalItems)} {t("of")} {totalItems} {t("entries")}
          </>
        )}
        {itemsCount && (
          <>
            {t("showing")} {itemsCount} {t("items")}
          </>
        )}
      </div>
      
      <div className="flex items-center space-x-2">
        {showControls && (
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label={t("previousPage")}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
        
        <div className="flex space-x-2">
          {pages.map((page, i) => 
            page === "dots" ? (
              <Button
                key={`dots-${i}`}
                variant="outline"
                size="icon"
                disabled
                className="cursor-default"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                key={page}
                variant={page === currentPage ? "default" : "outline"}
                size="icon"
                onClick={() => onPageChange(page)}
                aria-label={t("goToPage", { page })}
                aria-current={page === currentPage ? "page" : undefined}
              >
                {page}
              </Button>
            )
          )}
        </div>
        
        {showControls && (
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label={t("nextPage")}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
        
        {onPageSizeChange && pageSizeOptions && (
          <select
            className="border rounded-md px-2 py-1 text-sm bg-background"
            value={itemsPerPage}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            aria-label={t("itemsPerPage")}
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size} {t("perPage")}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
}

// These subcomponents are provided for compatibility with nested pagination UIs
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
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("", className)} {...props} />
));
PaginationItem.displayName = "PaginationItem";

export const PaginationLink = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <Button
    ref={ref}
    variant="outline"
    size="icon"
    className={cn("h-9 w-9", className)}
    {...props}
  />
));
PaginationLink.displayName = "PaginationLink";

export const PaginationPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <Button
    ref={ref}
    variant="outline"
    size="icon"
    className={cn("h-9 w-9 gap-1", className)}
    {...props}
  >
    <ChevronLeft className="h-4 w-4" />
  </Button>
));
PaginationPrevious.displayName = "PaginationPrevious";

export const PaginationNext = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <Button
    ref={ref}
    variant="outline"
    size="icon"
    className={cn("h-9 w-9 gap-1", className)}
    {...props}
  >
    <ChevronRight className="h-4 w-4" />
  </Button>
));
PaginationNext.displayName = "PaginationNext";

export const PaginationEllipsis = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </div>
));
PaginationEllipsis.displayName = "PaginationEllipsis";
