
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

export const useDeleteSalesProcess = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { t } = useLanguage();

  const deleteSalesProcess = async (id: string): Promise<boolean> => {
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('sales_processes')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      toast.success(t("salesProcessDeleted"), {
        description: t("salesProcessDeletedDescription")
      });
      
      return true;
    } catch (err) {
      console.error("Error deleting sales process:", err);
      toast.error(t("errorDeletingSalesProcess"));
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    deleteSalesProcess,
    isDeleting
  };
};
