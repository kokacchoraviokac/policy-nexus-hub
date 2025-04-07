
import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

export interface PaginationProps {
  itemsCount: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  totalPages?: number;
  children?: React.ReactNode;
}

export interface PaginationItemProps {
  page: number;
  onClick: (page: number) => void;
  isActive?: boolean;
  children?: React.ReactNode;
}

export const PaginationItem: React.FC<PaginationItemProps> = ({
  page,
  onClick,
  isActive = false,
  children
}) => {
  return (
    <Button
      variant={isActive ? "default" : "outline"}
      size="sm"
      onClick={() => onClick(page)}
      className={cn("w-9 h-9 p-0", {
        "bg-primary text-primary-foreground": isActive,
      })}
    >
      {children || page}
    </Button>
  );
};

export const Pagination: React.FC<PaginationProps> = ({
  itemsCount,
  itemsPerPage,
  currentPage,
  onPageChange,
  totalPages: externalTotalPages,
  children
}) => {
  // Calculate total pages if not provided externally
  const totalPages = externalTotalPages || Math.ceil(itemsCount / itemsPerPage);
  
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    onPageChange(page);
  };

  // Generate array of visible page numbers
  const getPageNumbers = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    if (currentPage <= 3) {
      return [1, 2, 3, 4, 5, "...", totalPages];
    }
    
    if (currentPage >= totalPages - 2) {
      return [1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    
    return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center space-x-1 mt-4">
      {children ? (
        <>{children}</>
      ) : (
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="w-9 h-9 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {getPageNumbers().map((page, index) => {
            if (page === "...") {
              return (
                <Button
                  key={`ellipsis-${index}`}
                  variant="outline"
                  size="sm"
                  disabled
                  className="w-9 h-9 p-0"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              );
            }

            return (
              <PaginationItem
                key={`page-${page}`}
                page={page as number}
                onClick={handlePageChange}
                isActive={currentPage === page}
              />
            );
          })}

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="w-9 h-9 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </>
      )}
    </div>
  );
};
