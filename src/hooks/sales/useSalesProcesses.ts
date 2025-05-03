
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { 
  SalesProcess, 
  CreateSalesProcessRequest, 
  UpdateSalesProcessRequest 
} from "@/types/sales/salesProcesses";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/auth/AuthContext";

export const useSalesProcesses = (searchQuery: string = "", stageFilter: string = "all", statusFilter: string = "all") => {
  const [salesProcesses, setSalesProcesses] = useState<SalesProcess[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { t } = useLanguage();
  const { user } = useAuth();

  const fetchSalesProcesses = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      let query = supabase
        .from('sales_processes')
        .select('*')
        .order('created_at', { ascending: false });
      
      // Apply stage filter if not "all"
      if (stageFilter !== "all") {
        query = query.eq('stage', stageFilter);
      }
      
      // Apply status filter if not "all"
      if (statusFilter !== "all") {
        query = query.eq('status', statusFilter);
      }
      
      // Apply search query if provided
      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,client_name.ilike.%${searchQuery}%,company.ilike.%${searchQuery}%`);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      setSalesProcesses(data as SalesProcess[]);
    } catch (err) {
      console.error("Error fetching sales processes:", err);
      setError(err as Error);
      toast.error(t("errorFetchingSalesProcesses"));
    } finally {
      setIsLoading(false);
    }
  };

  const createSalesProcess = async (processData: CreateSalesProcessRequest): Promise<SalesProcess | null> => {
    try {
      // Make sure we include the company_id
      const dataWithCompany = {
        ...processData,
        company_id: user?.companyId,
      };
      
      const { data, error } = await supabase
        .from('sales_processes')
        .insert([dataWithCompany])
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      // Refresh the sales processes list
      fetchSalesProcesses();
      
      toast.success(t("salesProcessCreated"), {
        description: t("salesProcessCreatedDescription", { title: processData.title })
      });
      
      return data as SalesProcess;
    } catch (err) {
      console.error("Error creating sales process:", err);
      toast.error(t("errorCreatingSalesProcess"));
      return null;
    }
  };

  const updateSalesProcess = async (id: string, processData: UpdateSalesProcessRequest): Promise<SalesProcess | null> => {
    try {
      const { data, error } = await supabase
        .from('sales_processes')
        .update(processData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      // Refresh the sales processes list
      fetchSalesProcesses();
      
      toast.success(t("salesProcessUpdated"), {
        description: t("salesProcessUpdatedDescription")
      });
      
      return data as SalesProcess;
    } catch (err) {
      console.error("Error updating sales process:", err);
      toast.error(t("errorUpdatingSalesProcess"));
      return null;
    }
  };

  const deleteSalesProcess = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('sales_processes')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      // Refresh the sales processes list
      fetchSalesProcesses();
      
      toast.success(t("salesProcessDeleted"), {
        description: t("salesProcessDeletedDescription")
      });
      
      return true;
    } catch (err) {
      console.error("Error deleting sales process:", err);
      toast.error(t("errorDeletingSalesProcess"));
      return false;
    }
  };

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
  }, [searchQuery, stageFilter, statusFilter]);

  return {
    salesProcesses,
    isLoading,
    error,
    createSalesProcess,
    updateSalesProcess,
    deleteSalesProcess,
    refresh: fetchSalesProcesses,
    stats: calculateProcessStats()
  };
};
