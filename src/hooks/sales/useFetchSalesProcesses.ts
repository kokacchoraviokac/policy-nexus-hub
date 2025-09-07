
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SalesProcess } from "@/types/sales/salesProcesses";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { DbSalesProcess, mapDbToSalesProcess } from "./types/salesProcessDb";

export const useFetchSalesProcesses = (searchQuery: string = "", stageFilter: string = "all", statusFilter: string = "all") => {
  const [salesProcesses, setSalesProcesses] = useState<SalesProcess[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { t } = useLanguage();

  const fetchSalesProcesses = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('sales_processes')
        .select('*')
        .order('created_at', { ascending: false });

      // Apply stage filter if not "all"
      if (stageFilter !== "all") {
        query = query.eq('current_step', stageFilter); // Map stage to current_step in DB
      }

      // Apply status filter if not "all"
      if (statusFilter !== "all") {
        query = query.eq('status', statusFilter);
      }

      // Apply search query if provided
      if (searchQuery) {
        query = query.or(`sales_number.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      // Map the data to our type
      const mappedData = data ? data.map(row => mapDbToSalesProcess(row as DbSalesProcess)) : [];
      setSalesProcesses(mappedData);

    } catch (err) {
      console.error("Error fetching sales processes:", err);
      setError(err as Error);
      toast.error(t("errorFetchingSalesProcesses"));
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, stageFilter, statusFilter, t]);

  // Calculate sales process statistics by stage
  const calculateProcessStats = () => {
    const stats = salesProcesses.reduce((acc, process) => {
      acc[process.stage] = (acc[process.stage] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      total: salesProcesses.length,
      quote: stats.quote || 0,
      authorization: stats.authorization || 0,
      request: stats.request || 0,
      proposal: stats.proposal || 0,
      receipt: stats.receipt || 0,
      signed: stats.signed || 0,
      concluded: stats.concluded || 0
    };
  };

  // Initial load
  useEffect(() => {
    fetchSalesProcesses();
  }, [fetchSalesProcesses]);

  return {
    salesProcesses,
    isLoading,
    error,
    refresh: fetchSalesProcesses,
    stats: calculateProcessStats()
  };
};
