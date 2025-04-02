
import { useState, useEffect, useMemo } from "react";
import { SalesProcess, UseSalesProcessDataProps, SalesProcessDataResult } from "@/types/salesProcess";
import { fetchSalesProcesses } from "@/services/salesProcessService";
import { filterSalesProcesses, calculateProcessesByStage } from "@/utils/salesProcessUtils";

export const useSalesProcessData = ({
  searchQuery = "",
  stageFilter = "all"
}: UseSalesProcessDataProps = {}): SalesProcessDataResult => {
  const [salesProcesses, setSalesProcesses] = useState<SalesProcess[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Function to fetch sales processes data
  const fetchProcesses = async () => {
    setIsLoading(true);
    try {
      const data = await fetchSalesProcesses();
      setSalesProcesses(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchProcesses();
  }, []);

  // Filtered sales processes based on search query and stage filter
  const filteredProcesses = useMemo(() => {
    return filterSalesProcesses(salesProcesses, searchQuery, stageFilter);
  }, [salesProcesses, searchQuery, stageFilter]);

  // Calculate totals by stage
  const processesByStage = useMemo(() => {
    return calculateProcessesByStage(salesProcesses);
  }, [salesProcesses]);

  return {
    salesProcesses: filteredProcesses,
    isLoading,
    error,
    refresh: fetchProcesses,
    totalProcesses: salesProcesses.length,
    processesByStage
  };
};
