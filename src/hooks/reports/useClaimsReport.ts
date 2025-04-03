
import { useState } from "react";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface ClaimsReportFilters {
  startDate?: Date | null;
  endDate?: Date | null;
  status?: string;
  searchTerm?: string;
}

export interface ClaimReportData {
  id: string;
  claim_number: string;
  policy_number: string;
  policyholder_name: string;
  incident_date: string;
  claimed_amount: number;
  approved_amount?: number;
  status: string;
  policy_id: string;
}

export interface ClaimsReportSummary {
  totalClaims: number;
  totalClaimedAmount: number;
  totalApprovedAmount: number;
  claimsByStatus: Record<string, number>;
}

export interface ClaimsReportResult {
  claims: ClaimReportData[];
  summary: ClaimsReportSummary;
}

export const useClaimsReport = (filters: ClaimsReportFilters): UseQueryResult<ClaimsReportResult> & {
  isExporting: boolean;
  setIsExporting: (value: boolean) => void;
} => {
  const [isExporting, setIsExporting] = useState(false);

  const query = useQuery({
    queryKey: ['claims-report', filters],
    queryFn: async () => {
      try {
        let query = supabase
          .from('claims')
          .select(`
            id,
            claim_number,
            incident_date,
            claimed_amount,
            approved_amount,
            status,
            policy_id,
            policies:policy_id (
              policy_number,
              policyholder_name
            )
          `)
          .order('created_at', { ascending: false });
        
        // Apply filters
        if (filters.status && filters.status !== "all") {
          query = query.eq('status', filters.status);
        }
        
        if (filters.startDate) {
          const startDateString = filters.startDate.toISOString().split('T')[0];
          query = query.gte('incident_date', startDateString);
        }
        
        if (filters.endDate) {
          const endDateString = filters.endDate.toISOString().split('T')[0];
          query = query.lte('incident_date', endDateString);
        }
        
        if (filters.searchTerm) {
          query = query.or(`claim_number.ilike.%${filters.searchTerm}%,policies.policy_number.ilike.%${filters.searchTerm}%,policies.policyholder_name.ilike.%${filters.searchTerm}%`);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        // Map and format the data
        const claims: ClaimReportData[] = data.map(claim => ({
          id: claim.id,
          claim_number: claim.claim_number,
          policy_number: claim.policies?.policy_number || "-",
          policyholder_name: claim.policies?.policyholder_name || "-",
          incident_date: claim.incident_date,
          claimed_amount: claim.claimed_amount,
          approved_amount: claim.approved_amount,
          status: claim.status,
          policy_id: claim.policy_id
        }));
        
        // Calculate summary data
        const totalClaimedAmount = claims.reduce((sum, claim) => sum + claim.claimed_amount, 0);
        const totalApprovedAmount = claims.reduce((sum, claim) => sum + (claim.approved_amount || 0), 0);
        
        // Count claims by status
        const claimsByStatus = claims.reduce((acc, claim) => {
          acc[claim.status] = (acc[claim.status] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        
        return {
          claims,
          summary: {
            totalClaims: claims.length,
            totalClaimedAmount,
            totalApprovedAmount,
            claimsByStatus
          }
        };
      } catch (error) {
        console.error("Error fetching claims report data:", error);
        toast.error("Failed to fetch claims report");
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  return {
    ...query,
    isExporting,
    setIsExporting
  };
};
