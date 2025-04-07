
import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/utils/shadcn";
import { Button } from "./button";

export interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  itemsCount?: number;
  itemsPerPage?: number;
  className?: string;
}

export interface PaginationItemProps {
  page: number;
  onClick: () => void;
  isActive?: boolean;
  children?: React.ReactNode;
}

export function Pagination({
  totalPages,
  currentPage,
  onPageChange,
  className,
}: PaginationProps) {
  return (
    <nav
      className={cn("flex items-center justify-center space-x-1", className)}
      aria-label="Pagination"
    >
      <PaginationPrevious
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
      />
      <PaginationContent>
        {totalPages <= 7 ? (
          Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                isActive={page === currentPage}
                onClick={() => onPageChange(page)}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))
        ) : (
          <>
            <PaginationItem>
              <PaginationLink
                isActive={currentPage === 1}
                onClick={() => onPageChange(1)}
              >
                1
              </PaginationLink>
            </PaginationItem>
            {currentPage > 3 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            {currentPage > 2 && (
              <PaginationItem>
                <PaginationLink onClick={() => onPageChange(currentPage - 1)}>
                  {currentPage - 1}
                </PaginationLink>
              </PaginationItem>
            )}
            {currentPage !== 1 && currentPage !== totalPages && (
              <PaginationItem>
                <PaginationLink isActive={true}>
                  {currentPage}
                </PaginationLink>
              </PaginationItem>
            )}
            {currentPage < totalPages - 1 && (
              <PaginationItem>
                <PaginationLink onClick={() => onPageChange(currentPage + 1)}>
                  {currentPage + 1}
                </PaginationLink>
              </PaginationItem>
            )}
            {currentPage < totalPages - 2 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            <PaginationItem>
              <PaginationLink
                isActive={currentPage === totalPages}
                onClick={() => onPageChange(totalPages)}
              >
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          </>
        )}
      </PaginationContent>
      <PaginationNext
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
      />
    </nav>
  );
}

export function PaginationContent({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-1">
      {children}
    </div>
  );
}

export function PaginationItem({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      {children}
    </div>
  );
}

export function PaginationLink({
  children,
  isActive,
  onClick,
}: {
  children: React.ReactNode;
  isActive?: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      variant={isActive ? "outline" : "ghost"}
      size="icon"
      className={cn(
        "h-8 w-8",
        isActive && "bg-primary/10 border-primary text-primary"
      )}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}

export function PaginationPrevious({
  onClick,
  disabled = false,
}: {
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8"
      disabled={disabled}
      onClick={onClick}
    >
      <ChevronLeft className="h-4 w-4" />
      <span className="sr-only">Previous page</span>
    </Button>
  );
}

export function PaginationNext({
  onClick,
  disabled = false,
}: {
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8"
      disabled={disabled}
      onClick={onClick}
    >
      <ChevronRight className="h-4 w-4" />
      <span className="sr-only">Next page</span>
    </Button>
  );
}

export function PaginationEllipsis() {
  return (
    <div className="flex h-8 w-8 items-center justify-center">
      <MoreHorizontal className="h-4 w-4" />
      <span className="sr-only">More pages</span>
    </div>
  );
}
