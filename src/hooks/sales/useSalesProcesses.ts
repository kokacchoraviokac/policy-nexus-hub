
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { 
  SalesProcess, 
  CreateSalesProcessRequest, 
  UpdateSalesProcessRequest,
  SalesStatus,
  SalesStage
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
      // Define a function to map database column names to our type
      const mapDbResponseToSalesProcess = (row: any): SalesProcess => {
        return {
          id: row.id,
          title: row.sales_number || "", // Map sales_number to title 
          client_name: "Client", // Default placeholder for client name
          company: undefined, // Default undefined for company
          stage: (row.current_step || "quote") as SalesStage, // Map current_step to stage
          status: (row.status || "active") as SalesStatus,
          insurance_type: "Unknown", // Default value for insurance_type
          estimated_value: row.estimated_value || undefined,
          expected_close_date: row.expected_close_date || undefined,
          lead_id: row.lead_id || undefined,
          assigned_to: row.assigned_to || undefined,
          notes: row.notes || undefined,
          company_id: row.company_id,
          created_at: row.created_at,
          updated_at: row.updated_at
        };
      };
      
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
      const mappedData = data ? data.map(mapDbResponseToSalesProcess) : [];
      setSalesProcesses(mappedData);
      
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
      // Make sure we include the company_id and default values
      const dataWithDefaults = {
        sales_number: processData.title, // Map title to sales_number
        company_id: user?.companyId,
        current_step: 'quote', // Map stage to current_step in DB
        status: 'active',
        estimated_value: processData.estimated_value,
        expected_close_date: processData.expected_close_date,
        lead_id: processData.lead_id,
        assigned_to: processData.assigned_to,
        notes: processData.notes
      };
      
      const { data, error } = await supabase
        .from('sales_processes')
        .insert([dataWithDefaults])
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
      
      // Map the response to our type using the same mapper as in fetchSalesProcesses
      const mappedProcess: SalesProcess = {
        id: data.id,
        title: data.sales_number || "", // Map sales_number to title
        client_name: "Client", // Default placeholder
        company: undefined, // Default undefined
        stage: (data.current_step || "quote") as SalesStage,
        status: (data.status || "active") as SalesStatus,
        insurance_type: "Unknown", // Default value
        estimated_value: data.estimated_value || undefined,
        expected_close_date: data.expected_close_date || undefined,
        lead_id: data.lead_id || undefined,
        assigned_to: data.assigned_to || undefined,
        notes: data.notes || undefined,
        company_id: data.company_id,
        created_at: data.created_at,
        updated_at: data.updated_at
      };
      
      return mappedProcess;
    } catch (err) {
      console.error("Error creating sales process:", err);
      toast.error(t("errorCreatingSalesProcess"));
      return null;
    }
  };

  const updateSalesProcess = async (id: string, processData: UpdateSalesProcessRequest): Promise<SalesProcess | null> => {
    try {
      // Map stage to current_step if it exists in the update data
      const dataForDb: Record<string, any> = { ...processData };
      
      if (dataForDb.stage) {
        dataForDb.current_step = dataForDb.stage;
        delete dataForDb.stage;
      }
      
      if (dataForDb.title) {
        dataForDb.sales_number = dataForDb.title;
        delete dataForDb.title;
      }
      
      // Remove client_name, company, and insurance_type as they don't exist in the DB
      if (dataForDb.client_name) delete dataForDb.client_name;
      if (dataForDb.company) delete dataForDb.company;
      if (dataForDb.insurance_type) delete dataForDb.insurance_type;
      
      const { data, error } = await supabase
        .from('sales_processes')
        .update(dataForDb)
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
      
      // Map the response to our type using the same mapper as above
      const mappedProcess: SalesProcess = {
        id: data.id,
        title: data.sales_number || "", // Map sales_number to title
        client_name: "Client", // Default placeholder
        company: undefined, // Default undefined
        stage: (data.current_step || "quote") as SalesStage,
        status: (data.status || "active") as SalesStatus,
        insurance_type: "Unknown", // Default value
        estimated_value: data.estimated_value || undefined,
        expected_close_date: data.expected_close_date || undefined,
        lead_id: data.lead_id || undefined,
        assigned_to: data.assigned_to || undefined,
        notes: data.notes || undefined,
        company_id: data.company_id,
        created_at: data.created_at,
        updated_at: data.updated_at
      };
      
      return mappedProcess;
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
