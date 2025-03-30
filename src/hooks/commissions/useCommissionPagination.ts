
import { useState } from "react";

export const useCommissionPagination = () => {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10
  });
  
  return {
    pagination,
    setPagination
  };
};
