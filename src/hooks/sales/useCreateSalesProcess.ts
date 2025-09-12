
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SalesProcess, CreateSalesProcessRequest } from "@/types/sales/salesProcesses";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/auth/AuthContext";
import { DbSalesProcess, mapDbToSalesProcess } from "./types/salesProcessDb";

export const useCreateSalesProcess = () => {
  const [isCreating, setIsCreating] = useState(false);
  const { t } = useLanguage();
  const { user } = useAuth();

  const createSalesProcess = async (processData: CreateSalesProcessRequest): Promise<SalesProcess | null> => {
    setIsCreating(true);
    try {
      // Use mock data for testing - simulate successful creation
      console.log("Creating sales process with mock data:", processData);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newSalesProcess: SalesProcess = {
        id: `sp-${Date.now()}`,
        title: processData.title,
        client_name: processData.client_name || "Unknown Client",
        company: processData.company,
        stage: "quote",
        status: "active",
        insurance_type: processData.insurance_type,
        estimated_value: processData.estimated_value,
        expected_close_date: processData.expected_close_date,
        company_id: user?.companyId || 'default-company',
        lead_id: processData.lead_id,
        assigned_to: processData.assigned_to || user?.id,
        notes: processData.notes,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      toast.success(t("salesProcessCreated"), {
        description: `Sales process "${processData.title}" created successfully`
      });
      
      console.log("Mock sales process created:", newSalesProcess);
      return newSalesProcess;
      
    } catch (err) {
      console.error("Error creating sales process:", err);
      toast.error(t("errorCreatingSalesProcess"));
      return null;
    } finally {
      setIsCreating(false);
    }
  };

  return {
    createSalesProcess,
    isCreating
  };
};
