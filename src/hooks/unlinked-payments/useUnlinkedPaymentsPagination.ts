
import { useState } from "react";

export interface PaginationState {
  pageIndex: number;
  pageSize: number;
}

export const useUnlinkedPaymentsPagination = () => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10
  });

  return {
    pagination,
    setPagination
  };
};
