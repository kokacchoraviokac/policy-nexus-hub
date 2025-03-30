
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { CommissionType } from "@/types/finances";

export interface CommissionFilterOptions {
  searchTerm?: string;
  startDate?: Date | null;
  endDate?: Date | null;
  status?: string;
  insurerId?: string;
  agentId?: string;
}

export const useCommissions = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<CommissionFilterOptions>({
    searchTerm: "",
    startDate: null,
    endDate: null,
    status: "all"
  });
  
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10
  });

  const fetchCommissions = async ({ pageIndex, pageSize, filters }: { 
    pageIndex: number, 
    pageSize: number, 
    filters: CommissionFilterOptions 
  }) => {
    try {
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
      
      // Apply status filter
      if (filters.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }
      
      // Apply search term filter to policyholder name or policy number
      if (filters.searchTerm) {
        query = query.or(`policies.policy_number.ilike.%${filters.searchTerm}%,policies.policyholder_name.ilike.%${filters.searchTerm}%`);
      }
      
      // Apply date range filters to payment_date
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
      
      // Apply pagination
      const from = pageIndex * pageSize;
      const to = from + pageSize - 1;
      
      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(from, to);
      
      if (error) throw error;

      // Transform data to include policy details
      const transformedData = data.map((commission: any) => ({
        ...commission,
        policy_number: commission.policies?.policy_number,
        policyholder_name: commission.policies?.policyholder_name,
        insurer_name: commission.policies?.insurer_name,
        product_name: commission.policies?.product_name,
        agent_name: commission.agents?.name,
        currency: commission.policies?.currency || 'EUR'
      }));
      
      return {
        data: transformedData as (CommissionType & {
          policy_number?: string;
          policyholder_name?: string;
          insurer_name?: string;
          product_name?: string;
          agent_name?: string;
          currency?: string;
        })[],
        totalCount: count || 0
      };
    } catch (error) {
      console.error("Error fetching commissions:", error);
      throw error;
    }
  };

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['commissions', pagination, filters],
    queryFn: () => fetchCommissions({
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
      filters
    }),
  });

  const calculateCommissionMutation = useMutation({
    mutationFn: async ({ policyId, baseAmount, rate }: { 
      policyId: string; 
      baseAmount: number; 
      rate: number 
    }) => {
      // Calculate commission amount
      const calculatedAmount = (baseAmount * rate) / 100;
      
      const { data, error } = await supabase
        .from('commissions')
        .insert({
          policy_id: policyId,
          base_amount: baseAmount,
          rate: rate,
          calculated_amount: calculatedAmount,
          status: 'due'
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commissions'] });
      toast({
        title: t("commissionCalculated"),
        description: t("commissionCalculationSuccess"),
      });
    },
    onError: (error) => {
      console.error('Error calculating commission:', error);
      toast({
        title: t("errorCalculatingCommission"),
        description: error instanceof Error ? error.message : t("unknownError"),
        variant: "destructive",
      });
    },
  });

  const updateCommissionStatusMutation = useMutation({
    mutationFn: async ({ commissionId, status, paymentDate, paidAmount }: { 
      commissionId: string; 
      status: string;
      paymentDate?: string;
      paidAmount?: number;
    }) => {
      const updateData: any = { status };
      
      if (status === 'paid' && paymentDate) {
        updateData.payment_date = paymentDate;
      }
      
      if (status === 'paid' && paidAmount !== undefined) {
        updateData.paid_amount = paidAmount;
      }
      
      const { data, error } = await supabase
        .from('commissions')
        .update(updateData)
        .eq('id', commissionId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commissions'] });
      toast({
        title: t("commissionUpdated"),
        description: t("commissionStatusUpdated"),
      });
    },
    onError: (error) => {
      console.error('Error updating commission status:', error);
      toast({
        title: t("errorUpdatingCommission"),
        description: error instanceof Error ? error.message : t("unknownError"),
        variant: "destructive",
      });
    },
  });

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
    commissions: data?.data || [],
    totalCount: data?.totalCount || 0,
    isLoading,
    isError,
    error,
    refetch,
    filters,
    setFilters,
    pagination,
    setPagination,
    calculateCommission: calculateCommissionMutation.mutate,
    isCalculating: calculateCommissionMutation.isPending,
    updateCommissionStatus: updateCommissionStatusMutation.mutate,
    isUpdating: updateCommissionStatusMutation.isPending,
    exportCommissions
  };
};
