
import React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

interface PaginationProps {
  currentPage: number;
  totalPages?: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  itemsCount?: number;
  itemsPerPage?: number;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages: propsTotalPages,
  onPageChange,
  siblingCount = 1,
  itemsCount,
  itemsPerPage
}) => {
  const { t } = useLanguage();
  
  // Calculate totalPages if not provided directly
  const totalPages = propsTotalPages || 
    (itemsCount && itemsPerPage ? Math.ceil(itemsCount / itemsPerPage) : 1);

  // Function to create a range of pages
  const range = (start: number, end: number) => {
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  // Generate the page numbers to display
  const generatePagination = () => {
    // If there are only a few pages, show all
    if (totalPages <= 5) {
      return range(1, totalPages);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    // Whether to show dots on left/right
    const showLeftDots = leftSiblingIndex > 2;
    const showRightDots = rightSiblingIndex < totalPages - 1;

    if (!showLeftDots && showRightDots) {
      // Show first pages and dots on right
      return [...range(1, 3), "dots", totalPages];
    }

    if (showLeftDots && !showRightDots) {
      // Show dots on left and last pages
      return [1, "dots", ...range(totalPages - 2, totalPages)];
    }

    // Show dots on both sides
    return [1, "dots", ...range(leftSiblingIndex, rightSiblingIndex), "dots", totalPages];
  };

  const pages = generatePagination();

  return (
    <nav className="flex items-center space-x-1">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label={t("previousPage")}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {pages.map((page, i) => {
        if (page === "dots") {
          return (
            <span key={`dots-${i}`} className="flex items-center justify-center h-8 w-8">
              <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
            </span>
          );
        }

        return (
          <Button
            key={`page-${page}`}
            variant={currentPage === page ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(page as number)}
            className="h-8 w-8 p-0"
          >
            {page}
          </Button>
        );
      })}

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label={t("nextPage")}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </nav>
  );
};
