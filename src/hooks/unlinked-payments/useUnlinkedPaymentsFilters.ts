
import { useState } from "react";

export interface FilterOptions {
  searchTerm?: string;
  startDate?: Date | null;
  endDate?: Date | null;
  status?: string;
}

export const useUnlinkedPaymentsFilters = () => {
  const [filters, setFilters] = useState<FilterOptions>({
    searchTerm: "",
    startDate: null,
    endDate: null,
    status: "unlinked"
  });

  return {
    filters,
    setFilters
  };
};
