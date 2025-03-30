
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { CommissionFilterOptions } from "./useCommissionFilters";
import { AuthContext } from "@/contexts/auth/AuthContext";
import { useContext } from "react";

export const useCommissionsData = (
  pagination: { pageIndex: number; pageSize: number },
  filters: CommissionFilterOptions
) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { user } = useContext(AuthContext);
  
  // Get the current user's company_id
  const companyId = user?.user_metadata?.company_id;
  
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
      
      // Apply company filter if available
      if (companyId) {
        query = query.eq('company_id', companyId);
      }
      
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
        data: transformedData,
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
  
  return {
    commissions: data?.data || [],
    totalCount: data?.totalCount || 0,
    isLoading,
    isError,
    error,
    refetch
  };
};
