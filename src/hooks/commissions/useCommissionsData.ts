
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { CommissionFilterOptions } from "./useCommissionFilters";
import { AuthContext } from "@/contexts/auth/AuthContext";
import { useContext } from "react";
import { CommissionType } from "@/types/finances";

export const useCommissionsData = (
  pagination: { pageIndex: number; pageSize: number },
  filters: CommissionFilterOptions
) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { user } = useContext(AuthContext);
  
  // Get the current user's company_id
  const companyId = user?.companyId;
  
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
          )
        `, { count: 'exact' });
      
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
      
      // Apply agent filter if provided - removed the join with agents table to fix the infinite type issue
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
      const transformedData = data.map((commission) => {
        // Ensure that the status is one of the valid values
        let validStatus: CommissionType["status"] = "due";
        
        if (commission.status === "paid" || 
            commission.status === "partially_paid" || 
            commission.status === "calculating") {
          validStatus = commission.status;
        }
        
        return {
          ...commission,
          status: validStatus,
          policy_number: commission.policies?.policy_number,
          policyholder_name: commission.policies?.policyholder_name,
          insurer_name: commission.policies?.insurer_name,
          product_name: commission.policies?.product_name,
          agent_name: null, // We're no longer fetching agent name in this query
          currency: commission.policies?.currency || 'EUR'
        };
      });
      
      return {
        data: transformedData as (CommissionType & {
          policy_number?: string;
          policyholder_name?: string;
          insurer_name?: string;
          product_name?: string;
          agent_name?: string | null;
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
  
  return {
    commissions: data?.data || [],
    totalCount: data?.totalCount || 0,
    isLoading,
    isError,
    error,
    refetch
  };
};
