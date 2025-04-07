
import React from "react";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

interface PaginationControllerProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsCount?: number;
  itemsPerPage?: number;
  className?: string;
}

export function PaginationController({
  currentPage,
  totalPages,
  onPageChange,
  itemsCount,
  itemsPerPage,
  className,
}: PaginationControllerProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
      itemsCount={itemsCount}
      itemsPerPage={itemsPerPage}
      className={className}
    />
  );
}
