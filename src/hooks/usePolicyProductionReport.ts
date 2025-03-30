
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PolicyReportFilters, PolicyReportData } from "@/utils/policies/policyReportUtils";

export const usePolicyProductionReport = (filters: PolicyReportFilters) => {
  const [isExporting, setIsExporting] = useState(false);

  const query = useQuery({
    queryKey: ['policy-production-report', filters],
    queryFn: async () => {
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
        `);
      
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
      
      // Order by expiry date (newest first)
      query = query.order('expiry_date', { ascending: false });
      
      const { data, error, count } = await query;
      
      if (error) {
        console.error("Error fetching policy report data:", error);
        throw error;
      }
      
      return {
        policies: data as PolicyReportData[],
        totalCount: count || 0
      };
    }
  });

  return {
    ...query,
    isExporting,
    setIsExporting
  };
};
