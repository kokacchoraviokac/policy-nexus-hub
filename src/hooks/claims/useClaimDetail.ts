
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface StatusHistoryEntry {
  from: string;
  to: string;
  timestamp: string;
  note?: string;
}

export const useClaimDetail = (claimId: string | undefined) => {
  const { 
    data: claim, 
    isLoading, 
    isError, 
    refetch 
  } = useQuery({
    queryKey: ['claim', claimId],
    queryFn: async () => {
      if (!claimId) throw new Error("Claim ID is required");
      
      const { data, error } = await supabase
        .from('claims')
        .select(`
          *,
          policies:policy_id (
            policy_number,
            policyholder_name,
            insurer_name
          )
        `)
        .eq('id', claimId)
        .single();
      
      if (error) throw error;
      
      // Initialize status_history if it doesn't exist or isn't an array
      if (!data.status_history || !Array.isArray(data.status_history)) {
        data.status_history = [];
      }
      
      return data;
    },
    enabled: !!claimId
  });

  return {
    claim,
    isLoading,
    isError,
    refetch
  };
};
