
import { useState } from "react";

export interface PaginationState {
  page: number;
  pageSize: number;
}

export const useUnlinkedPaymentsPagination = () => {
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    pageSize: 10,
  });

  return {
    pagination,
    setPagination,
  };
};
