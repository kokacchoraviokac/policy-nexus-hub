
import { FilterOptions, useUnlinkedPaymentsFilters } from "./useUnlinkedPaymentsFilters";
import { PaginationState, useUnlinkedPaymentsPagination } from "./useUnlinkedPaymentsPagination";
import { useUnlinkedPaymentsMutations } from "./useUnlinkedPaymentsMutations";
import { useUnlinkedPaymentsExport } from "./useUnlinkedPaymentsExport";
import { useUnlinkedPaymentsQuery, UnlinkedPayment } from "./useUnlinkedPaymentsQuery";

export { 
  type FilterOptions,
  type PaginationState,
  type UnlinkedPayment
};

export const useUnlinkedPayments = () => {
  // Use the smaller, focused hooks
  const { filters, setFilters } = useUnlinkedPaymentsFilters();
  const { pagination, setPagination } = useUnlinkedPaymentsPagination();
  const { linkPayment, isLinking } = useUnlinkedPaymentsMutations();
  const { exportPayments } = useUnlinkedPaymentsExport(filters);
  const { data, isLoading, isError, error, refetch } = useUnlinkedPaymentsQuery(pagination, filters);

  return {
    payments: data?.data || [],
    totalCount: data?.totalCount || 0,
    isLoading,
    isError,
    error,
    refetch,
    filters,
    setFilters,
    pagination,
    setPagination,
    linkPayment,
    isLinking,
    exportPayments
  };
};
