
import { useState } from "react";

export interface PaginationState {
  page: number;
  pageSize: number;
  pageIndex?: number; // Added to match usage in components
}

export const useUnlinkedPaymentsPagination = () => {
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    pageSize: 10,
    pageIndex: 0, // Initialize pageIndex
  });

  return {
    pagination,
    setPagination,
  };
};
