
import { useState } from "react";

export interface CommissionFilterOptions {
  searchTerm?: string;
  startDate?: Date | null;
  endDate?: Date | null;
  status?: string;
  insurerId?: string;
  agentId?: string;
  companyId?: string; // Added this property
}

export const useCommissionFilters = () => {
  const [filters, setFilters] = useState<CommissionFilterOptions>({
    searchTerm: "",
    startDate: null,
    endDate: null,
    status: "all"
  });
  
  const resetFilters = () => {
    setFilters({
      searchTerm: "",
      startDate: null,
      endDate: null,
      status: "all"
    });
  };
  
  return {
    filters,
    setFilters,
    resetFilters
  };
};
