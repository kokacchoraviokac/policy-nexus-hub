
import React from "react";
import { PaginationControllerProps } from "@/types/pagination";
import Pagination from "./pagination";

export const PaginationController: React.FC<PaginationControllerProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsCount,
  itemsPerPage,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions
}) => {
  return (
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      itemsCount={totalItems || itemsCount}
      itemsPerPage={itemsPerPage}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      pageSizeOptions={pageSizeOptions}
    />
  );
};
