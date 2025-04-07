
import React from "react";
import Pagination from "@/components/ui/pagination";

// This is a wrapper component that maintains backward compatibility
// with the previous implementation while using the new Pagination component
export interface PaginationControllerProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  itemsCount?: number;
  itemsPerPage?: number;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
}

export function PaginationController(props: PaginationControllerProps) {
  // Simply pass all props to the Pagination component
  return <Pagination {...props} />;
}

export default PaginationController;
