
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
      // Use mock data for testing quote management workflow
      console.log("Using mock sales processes data for testing");
      
      const mockSalesProcesses: SalesProcess[] = [
        {
          id: "sp-1",
          title: "Test Quote Management Process",
          client_name: "John Smith",
          company: "Smith Industries Ltd",
          stage: "quote",
          status: "active",
          insurance_type: "auto",
          estimated_value: 1500,
          expected_close_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          company_id: "default-company",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          notes: "Testing quote management workflow"
        },
        {
          id: "sp-2",
          title: "Property Insurance Process",
          client_name: "Jane Doe",
          company: "Doe Enterprises",
          stage: "authorization",
          status: "active",
          insurance_type: "property",
          estimated_value: 2500,
          expected_close_date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
          company_id: "default-company",
          created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          notes: "Property insurance for commercial building"
        }
      ];

      // Apply filters to mock data
      let filteredProcesses = mockSalesProcesses;

      if (stageFilter !== "all") {
        filteredProcesses = filteredProcesses.filter(process => process.stage === stageFilter);
      }

      if (searchQuery) {
        filteredProcesses = filteredProcesses.filter(process =>
          process.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          process.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (process.company && process.company.toLowerCase().includes(searchQuery.toLowerCase()))
        );
      }

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));

      setSalesProcesses(filteredProcesses);

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
