
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
        notes: processData.notes // Pass notes to the database
      };
      
      const { data, error } = await supabase
        .from('sales_processes')
        .insert([dataWithDefaults])
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      toast.success(t("salesProcessCreated"), {
        description: t("salesProcessCreatedDescription", { title: processData.title })
      });
      
      // Map the response to our type
      return mapDbToSalesProcess(data as DbSalesProcess);
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
