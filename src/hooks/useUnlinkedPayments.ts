
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { UnlinkedPaymentType } from "@/types/policies";
import Papa from "papaparse";

export type UnlinkedPayment = UnlinkedPaymentType;

export interface FilterOptions {
  searchTerm?: string;
  startDate?: Date | null;
  endDate?: Date | null;
  status?: string;
}

export const useUnlinkedPayments = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<FilterOptions>({
    searchTerm: "",
    startDate: null,
    endDate: null,
    status: "unlinked"
  });
  
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10
  });

  const fetchUnlinkedPayments = async ({ pageIndex, pageSize, filters }: { 
    pageIndex: number, 
    pageSize: number, 
    filters: FilterOptions 
  }) => {
    let query = supabase
      .from('unlinked_payments')
      .select('*', { count: 'exact' });
    
    // Apply status filter
    if (filters.status === 'linked') {
      query = query.not('linked_policy_id', 'is', null);
    } else if (filters.status === 'unlinked') {
      query = query.is('linked_policy_id', null);
    }
    
    // Apply search term filter
    if (filters.searchTerm) {
      query = query.or(`reference.ilike.%${filters.searchTerm}%,payer_name.ilike.%${filters.searchTerm}%`);
    }
    
    // Apply date range filters
    if (filters.startDate) {
      query = query.gte('payment_date', filters.startDate.toISOString().split('T')[0]);
    }
    
    if (filters.endDate) {
      query = query.lte('payment_date', filters.endDate.toISOString().split('T')[0]);
    }
    
    // Apply pagination
    const from = pageIndex * pageSize;
    const to = from + pageSize - 1;
    
    const { data, error, count } = await query
      .order('payment_date', { ascending: false })
      .range(from, to);
    
    if (error) throw error;
    
    return {
      data: data as UnlinkedPayment[],
      totalCount: count || 0
    };
  };

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['unlinked-payments', pagination, filters],
    queryFn: () => fetchUnlinkedPayments({ 
      pageIndex: pagination.pageIndex, 
      pageSize: pagination.pageSize, 
      filters 
    }),
  });

  const linkPaymentMutation = useMutation({
    mutationFn: async ({ paymentId, policyId }: { paymentId: string; policyId: string }) => {
      const { error } = await supabase
        .from('unlinked_payments')
        .update({
          linked_policy_id: policyId,
          linked_at: new Date().toISOString(),
          linked_by: (await supabase.auth.getUser()).data.user?.id,
          status: 'linked'
        })
        .eq('id', paymentId);
      
      if (error) throw error;
      return { paymentId, policyId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unlinked-payments'] });
      toast({
        title: t("paymentLinkSuccess"),
        description: t("paymentSuccessfullyLinked"),
      });
    },
    onError: (error) => {
      console.error('Error linking payment:', error);
      toast({
        title: t("errorLinkingPayment"),
        description: error instanceof Error ? error.message : t("unknownError"),
        variant: "destructive",
      });
    },
  });

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

  return {
    payments: data?.data || [],
    totalCount: data?.totalCount || 0,
    isLoading,
    isError,
    error,
    refetch,
    filters,
    setFilters,
    pagination,
    setPagination,
    linkPayment: linkPaymentMutation.mutate,
    isLinking: linkPaymentMutation.isPending,
    exportPayments
  };
};
