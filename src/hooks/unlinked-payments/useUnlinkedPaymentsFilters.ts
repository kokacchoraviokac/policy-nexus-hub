
import { useState } from "react";

export interface FilterOptions {
  searchTerm?: string;
  status?: string;
  dateFrom?: Date | null;
  dateTo?: Date | null;
  startDate?: Date | null;  // Added to match the usage in components
  endDate?: Date | null;    // Added to match the usage in components
}

export const useUnlinkedPaymentsFilters = () => {
  const [filters, setFilters] = useState<FilterOptions>({});

  return {
    filters,
    setFilters,
  };
};
