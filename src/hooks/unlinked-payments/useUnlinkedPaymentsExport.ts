
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import Papa from "papaparse";
import { FilterOptions } from "./useUnlinkedPaymentsFilters";

export const useUnlinkedPaymentsExport = (filters: FilterOptions) => {
  const { t } = useLanguage();
  const { toast } = useToast();

  const exportPayments = async (): Promise<void> => {
    try {
      toast({
        title: t("exportStarted"),
        description: t("preparingExportData"),
      });
      
      let query = supabase
        .from('unlinked_payments')
        .select('*, policies(policy_number)');
      
      // Apply the same filters as in fetchUnlinkedPayments but without pagination
      if (filters.status === 'linked') {
        query = query.not('linked_policy_id', 'is', null);
      } else if (filters.status === 'unlinked') {
        query = query.is('linked_policy_id', null);
      }
      
      if (filters.searchTerm) {
        query = query.or(`reference.ilike.%${filters.searchTerm}%,payer_name.ilike.%${filters.searchTerm}%`);
      }
      
      if (filters.startDate) {
        query = query.gte('payment_date', filters.startDate.toISOString().split('T')[0]);
      }
      
      if (filters.endDate) {
        query = query.lte('payment_date', filters.endDate.toISOString().split('T')[0]);
      }
      
      const { data, error } = await query.order('payment_date', { ascending: false });
      
      if (error) throw error;
      
      if (!data || data.length === 0) {
        toast({
          title: t("noDataToExport"),
          description: t("noPaymentsFoundToExport"),
        });
        return;
      }
      
      // Transform data for CSV export
      const exportData = data.map(payment => ({
        [t("reference")]: payment.reference || "-",
        [t("payerName")]: payment.payer_name || "-",
        [t("amount")]: payment.amount,
        [t("currency")]: payment.currency,
        [t("paymentDate")]: payment.payment_date,
        [t("status")]: payment.linked_policy_id ? t("linked") : t("unlinked"),
        [t("linkedPolicy")]: payment.policies?.policy_number || "-",
        [t("linkedAt")]: payment.linked_at ? new Date(payment.linked_at).toLocaleString() : "-"
      }));
      
      // Convert to CSV
      const csv = Papa.unparse(exportData);
      
      // Create download link
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `unlinked-payments-${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: t("exportCompleted"),
        description: t("paymentsExportedSuccessfully"),
      });
    } catch (error) {
      console.error('Error exporting payments:', error);
      toast({
        title: t("errorExportingPayments"),
        description: error instanceof Error ? error.message : t("unknownError"),
        variant: "destructive",
      });
    }
  };

  return { exportPayments };
};
