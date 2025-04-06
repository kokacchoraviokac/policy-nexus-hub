
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface PolicyAddendum {
  id: string;
  addendum_number: string;
  policy_id: string;
  description: string;
  effective_date: string;
  premium_adjustment?: number;
  lien_status: boolean;
  status: string;
  workflow_status: string;
  created_at: string;
  updated_at: string;
  company_id: string;
  created_by?: string;
}

export const usePolicyAddendums = (policyId: string) => {
  const {
    data: addendums,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['policy-addendums', policyId],
    queryFn: async () => {
      if (!policyId) return [];
      
      const { data, error } = await supabase
        .from('policy_addendums')
        .select('*')
        .eq('policy_id', policyId)
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Error fetching policy addendums:', error);
        throw new Error(`Failed to fetch addendums: ${error.message}`);
      }
      
      return data as PolicyAddendum[];
    },
    enabled: !!policyId
  });
  
  // Calculate addendum count
  const addendumCount = addendums?.length || 0;
  
  return {
    addendums: addendums || [],
    isLoading,
    error,
    refetch,
    addendumCount
  };
};
