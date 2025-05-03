
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SalesProcess, UpdateSalesProcessRequest } from "@/types/sales/salesProcesses";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { DbSalesProcess, mapDbToSalesProcess } from "./types/salesProcessDb";

export const useUpdateSalesProcess = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const { t } = useLanguage();

  const updateSalesProcess = async (id: string, processData: UpdateSalesProcessRequest): Promise<SalesProcess | null> => {
    setIsUpdating(true);
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
      
      toast.success(t("salesProcessUpdated"), {
        description: t("salesProcessUpdatedDescription")
      });
      
      // Map the response to our type
      return mapDbToSalesProcess(data as DbSalesProcess);
    } catch (err) {
      console.error("Error updating sales process:", err);
      toast.error(t("errorUpdatingSalesProcess"));
      return null;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    updateSalesProcess,
    isUpdating
  };
};
