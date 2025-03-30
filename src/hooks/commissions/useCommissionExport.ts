
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { CommissionFilterOptions } from "./useCommissionFilters";

export interface ExportCommissionsParams {
  filters: CommissionFilterOptions;
  includeHeaders?: boolean;
}

export const useCommissionExport = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [isExporting, setIsExporting] = useState(false);

  const exportCommissionsMutation = useMutation({
    mutationFn: async ({ filters, includeHeaders = true }: ExportCommissionsParams) => {
      setIsExporting(true);
      try {
        // Cast the query builder to 'any' to prevent deep type instantiation
        let query: any = supabase
          .from('commissions')
          .select(
            `
              *,
              policies(
                policy_number, 
                policyholder_name, 
                insurer_name,
                product_name,
                currency
              )
            `
          );
        
        // Apply company filter if available
        if (filters.companyId) {
          query = query.eq('company_id', filters.companyId);
        }
        
        // Apply status filter
        if (filters.status && filters.status !== 'all') {
          query = query.eq('status', filters.status);
        }
        
        // Apply date range filters to created_at
        if (filters.startDate) {
          query = query.gte('created_at', filters.startDate.toISOString());
        }
        
        if (filters.endDate) {
          // Add one day to include the end date fully
          const endDate = new Date(filters.endDate);
          endDate.setDate(endDate.getDate() + 1);
          query = query.lt('created_at', endDate.toISOString());
        }
        
        // Apply insurer filter if provided
        if (filters.insurerId) {
          query = query.eq('policies.insurer_id', filters.insurerId);
        }
        
        // Apply agent filter if provided
        if (filters.agentId) {
          query = query.eq('agent_id', filters.agentId);
        }
        
        const { data, error } = await query
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        if (!data || data.length === 0) {
          return { success: false, message: t("noCommissionsFoundToExport") };
        }
        
        // Transform data to include policy details
        const exportData = data.map((commission) => {
          return {
            policyNumber: commission.policies?.policy_number || '',
            policyholder: commission.policies?.policyholder_name || '',
            insurer: commission.policies?.insurer_name || '',
            product: commission.policies?.product_name || '',
            baseAmount: commission.base_amount,
            rate: commission.rate,
            calculatedAmount: commission.calculated_amount,
            paidAmount: commission.paid_amount || 0,
            status: commission.status,
            currency: commission.policies?.currency || 'EUR',
            createdAt: new Date(commission.created_at).toLocaleDateString(),
            paymentDate: commission.payment_date 
              ? new Date(commission.payment_date).toLocaleDateString() 
              : '',
          };
        });
        
        // Generate CSV content
        let csvContent = '';
        
        // Add headers if requested
        if (includeHeaders) {
          const headers = [
            t("policyNumber"),
            t("policyholder"),
            t("insurer"),
            t("product"),
            t("baseAmount"),
            t("rate"),
            t("calculatedAmount"),
            t("paidAmount"),
            t("status"),
            t("currency"),
            t("createdAt"),
            t("paymentDate"),
          ];
          csvContent += headers.join(',') + '\n';
        }
        
        // Add data rows
        exportData.forEach((row) => {
          const values = Object.values(row);
          csvContent += values.join(',') + '\n';
        });
        
        // Create a Blob and trigger download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `commissions_export_${new Date().toISOString().slice(0, 10)}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        return { success: true };
      } catch (error) {
        console.error("Error exporting commissions:", error);
        throw error;
      } finally {
        setIsExporting(false);
      }
    },
    onSuccess: (data) => {
      if (data.success) {
        toast({
          title: t("exportCompleted"),
          description: t("commissionsExportedSuccessfully"),
        });
      } else {
        toast({
          title: t("noDataToExport"),
          description: data.message,
        });
      }
    },
    onError: (error) => {
      console.error("Error exporting commissions:", error);
      toast({
        title: t("errorExportingCommissions"),
        description: t("unknownError"),
        variant: "destructive",
      });
    },
  });

  return {
    exportCommissions: exportCommissionsMutation.mutate,
    isExporting,
  };
};
