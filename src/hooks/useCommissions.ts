import { useState } from "react";
import { useCommissionsData } from "./commissions/useCommissionsData";
import { useCommissionFilters, CommissionFilterOptions } from "./commissions/useCommissionFilters";
import { useCommissionMutations } from "./commissions/useCommissionMutations";

export const useCommissions = () => {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const { filters, setFilters } = useCommissionFilters();
  
  const { 
    commissions, 
    totalCount, 
    isLoading, 
    refetch 
  } = useCommissionsData(pagination, filters);
  
  const { 
    updateCommissionStatus,
    isUpdatingStatus: isUpdating, // Add this line to fix the error
    calculateCommission,
    isCalculating
  } = useCommissionMutations();
  
  const exportCommissions = async () => {
    // Implementation placeholder for exporting commissions
    console.log("Exporting commissions...");
  };
  
  return {
    commissions,
    totalCount,
    isLoading,
    pagination,
    setPagination,
    filters,
    setFilters,
    updateCommissionStatus,
    isUpdating, // Make sure this is passed through
    calculateCommission,
    isCalculating,
    exportCommissions,
    refetch
  };
};
