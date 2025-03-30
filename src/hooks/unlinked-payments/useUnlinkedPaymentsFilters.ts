
import { useState } from "react";

export interface FilterOptions {
  searchTerm?: string;
  status?: string;
  dateFrom?: Date | null;
  dateTo?: Date | null;
}

export const useUnlinkedPaymentsFilters = () => {
  const [filters, setFilters] = useState<FilterOptions>({});

  return {
    filters,
    setFilters,
  };
};
