
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PolicyAddendum } from "@/types/policies";

export const usePolicyAddendums = (policyId: string) => {
  const {
    data: addendums,
    isLoading,
    isError,
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
      
      if (error) throw error;
      
      return data as PolicyAddendum[];
    },
    enabled: !!policyId
  });
  
  return {
    addendums,
    isLoading,
    isError,
    error,
    refetch
  };
};
