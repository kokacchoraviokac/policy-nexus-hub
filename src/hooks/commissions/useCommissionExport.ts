
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { CommissionFilterOptions } from "./useCommissionFilters";
import { AuthContext } from "@/contexts/auth/AuthContext";
import { useContext } from "react";

export const useCommissionExport = (filters: CommissionFilterOptions) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { user } = useContext(AuthContext);
  
  // Get the current user's company_id
  const companyId = user?.companyId;

  const exportCommissions = async (): Promise<void> => {
    try {
      toast({
        title: t("exportStarted"),
        description: t("preparingExportData"),
      });
      
      // Similar query as fetchCommissions but without pagination
      let query = supabase
        .from('commissions')
        .select(`
          *,
          policies(
            policy_number, 
            policyholder_name, 
            insurer_name,
            product_name,
            currency
          ),
          agents(name)
        `);
      
      // Apply company filter if available
      if (companyId) {
        query = query.eq('company_id', companyId);
      }
      
      if (filters.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }
      
      if (filters.searchTerm) {
        query = query.or(`policies.policy_number.ilike.%${filters.searchTerm}%,policies.policyholder_name.ilike.%${filters.searchTerm}%`);
      }
      
      if (filters.startDate) {
        query = query.gte('created_at', filters.startDate.toISOString());
      }
      
      if (filters.endDate) {
        const endDate = new Date(filters.endDate);
        endDate.setDate(endDate.getDate() + 1);
        query = query.lt('created_at', endDate.toISOString());
      }
      
      if (filters.insurerId) {
        query = query.eq('policies.insurer_id', filters.insurerId);
      }
      
      if (filters.agentId) {
        query = query.eq('agent_id', filters.agentId);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      
      if (!data || data.length === 0) {
        toast({
          title: t("noDataToExport"),
          description: t("noCommissionsFoundToExport"),
        });
        return;
      }
      
      // Transform and prepare data for CSV export
      const exportData = data.map((commission: any) => ({
        [t("policyNumber")]: commission.policies?.policy_number || "-",
        [t("policyholder")]: commission.policies?.policyholder_name || "-",
        [t("insurer")]: commission.policies?.insurer_name || "-",
        [t("agent")]: commission.agents?.name || "-",
        [t("baseAmount")]: commission.base_amount,
        [t("rate")]: commission.rate,
        [t("calculatedAmount")]: commission.calculated_amount,
        [t("status")]: t(commission.status),
        [t("paymentDate")]: commission.payment_date || "-",
        [t("paidAmount")]: commission.paid_amount || "-",
        [t("createdAt")]: new Date(commission.created_at).toLocaleString()
      }));
      
      // Convert to CSV using Papa Parse
      const Papa = await import('papaparse');
      const csv = Papa.default.unparse(exportData);
      
      // Create download link
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `commissions-export-${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: t("exportCompleted"),
        description: t("commissionsExportedSuccessfully"),
      });
    } catch (error) {
      console.error('Error exporting commissions:', error);
      toast({
        title: t("errorExportingCommissions"),
        description: error instanceof Error ? error.message : t("unknownError"),
        variant: "destructive",
      });
    }
  };

  return {
    exportCommissions
  };
};
