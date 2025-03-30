
import { useCommissionFilters } from "./commissions/useCommissionFilters";
import { useCommissionPagination } from "./commissions/useCommissionPagination";
import { useCommissionsData } from "./commissions/useCommissionsData";
import { useCommissionMutations } from "./commissions/useCommissionMutations";
import { useCommissionExport } from "./commissions/useCommissionExport";

export const useCommissions = () => {
  const { filters, setFilters, resetFilters } = useCommissionFilters();
  const { pagination, setPagination } = useCommissionPagination();
  const { 
    commissions, 
    totalCount, 
    isLoading, 
    isError, 
    error, 
    refetch 
  } = useCommissionsData(pagination, filters);
  const { 
    calculateCommission, 
    isCalculating, 
    updateCommissionStatus, 
    isUpdating 
  } = useCommissionMutations();
  const { exportCommissions } = useCommissionExport(filters);

  return {
    // Filters
    filters,
    setFilters,
    resetFilters,
    
    // Pagination
    pagination,
    setPagination,
    
    // Data
    commissions,
    totalCount,
    isLoading,
    isError,
    error,
    refetch,
    
    // Mutations
    calculateCommission,
    isCalculating,
    updateCommissionStatus,
    isUpdating,
    
    // Export
    exportCommissions
  };
};

// Re-export the types for use elsewhere
export type { CommissionFilterOptions } from "./commissions/useCommissionFilters";
