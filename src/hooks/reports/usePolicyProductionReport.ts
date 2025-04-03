
import { useState } from "react";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PolicyReportFilters, PolicyReportData } from "@/utils/policies/policyReportUtils";
import { toast } from "sonner";

export interface PolicyProductionReportResult {
  policies: PolicyReportData[];
  totalCount: number;
  summary: {
    totalPolicies: number;
    totalPremium: number;
    totalCommission: number;
    averagePremium: number;
    averageCommission: number;
  };
}

export const usePolicyProductionReport = (filters: PolicyReportFilters): UseQueryResult<PolicyProductionReportResult> & {
  isExporting: boolean;
  setIsExporting: (value: boolean) => void;
} => {
  const [isExporting, setIsExporting] = useState(false);

  const query = useQuery({
    queryKey: ['policy-production-report', filters],
    queryFn: async () => {
      try {
        // Start building the query
        let query = supabase
          .from('policies')
          .select(`
            id,
            policy_number,
            policyholder_name,
            insurer_name,
            product_name,
            start_date,
            expiry_date,
            premium,
            currency,
            commission_percentage,
            commission_amount,
            status
          `, { count: 'exact' });
        
        // Apply filters
        if (filters.clientId) {
          query = query.eq('client_id', filters.clientId);
        }
        
        if (filters.insurerId) {
          query = query.eq('insurer_id', filters.insurerId);
        }
        
        if (filters.productId) {
          query = query.eq('product_id', filters.productId);
        }
        
        if (filters.agentId) {
          query = query.eq('assigned_to', filters.agentId);
        }
        
        if (filters.startDate) {
          query = query.gte('start_date', filters.startDate.toISOString().split('T')[0]);
        }
        
        if (filters.endDate) {
          query = query.lte('expiry_date', filters.endDate.toISOString().split('T')[0]);
        }
        
        if (filters.status && filters.status !== 'all') {
          query = query.eq('status', filters.status);
        }
        
        // Order by expiry date (newest first)
        query = query.order('expiry_date', { ascending: false });
        
        const { data, error, count } = await query;
        
        if (error) {
          console.error("Error fetching policy report data:", error);
          throw error;
        }
        
        const policies = data as PolicyReportData[];
        const totalCount = count || 0;
        
        // Calculate summary metrics
        const totalPolicies = policies.length;
        const totalPremium = policies.reduce((sum, policy) => sum + (policy.premium || 0), 0);
        const totalCommission = policies.reduce((sum, policy) => sum + (policy.commission_amount || 0), 0);
        const averagePremium = totalPolicies > 0 ? totalPremium / totalPolicies : 0;
        const averageCommission = totalPolicies > 0 ? totalCommission / totalPolicies : 0;
        
        return {
          policies,
          totalCount,
          summary: {
            totalPolicies,
            totalPremium,
            totalCommission,
            averagePremium,
            averageCommission
          }
        };
      } catch (error) {
        console.error("Error in policy production report:", error);
        toast.error("Failed to fetch policy production report");
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false
  });

  return {
    ...query,
    isExporting,
    setIsExporting
  };
};
