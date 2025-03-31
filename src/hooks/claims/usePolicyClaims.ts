
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface PolicyClaimsSummary {
  totalClaims: number;
  activeClaims: number;
  totalClaimedAmount: number;
  claims: PolicyClaim[];
}

export interface PolicyClaim {
  id: string;
  claim_number: string;
  status: string;
  incident_date: string;
  claimed_amount: number;
  approved_amount?: number;
  damage_description: string;
  created_at: string;
}

export const usePolicyClaims = (policyId: string) => {
  const { 
    data, 
    isLoading, 
    isError, 
    refetch 
  } = useQuery({
    queryKey: ['policy-claims', policyId],
    queryFn: async () => {
      if (!policyId) return { totalClaims: 0, activeClaims: 0, totalClaimedAmount: 0, claims: [] };
      
      const { data, error } = await supabase
        .from('claims')
        .select('*')
        .eq('policy_id', policyId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const claims = data || [];
      const activeStatuses = ['in processing', 'reported', 'appealed'];
      const activeClaims = claims.filter(claim => 
        activeStatuses.includes(claim.status.toLowerCase())
      ).length;
      
      const totalClaimedAmount = claims.reduce((sum, claim) => 
        sum + (claim.claimed_amount || 0), 0
      );
      
      return {
        totalClaims: claims.length,
        activeClaims,
        totalClaimedAmount,
        claims
      };
    },
    enabled: !!policyId
  });

  return {
    claimsSummary: data || { totalClaims: 0, activeClaims: 0, totalClaimedAmount: 0, claims: [] },
    isLoading,
    isError,
    refetch
  };
};
