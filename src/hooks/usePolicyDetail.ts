
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useActivityLogger } from "@/utils/activityLogger";

export const usePolicyDetail = (policyId: string | undefined) => {
  const { logActivity } = useActivityLogger();

  return useQuery({
    queryKey: ['policy', policyId],
    queryFn: async () => {
      if (!policyId) throw new Error("Policy ID is required");
      
      // Get policy details
      const { data: policyData, error: policyError } = await supabase
        .from('policies')
        .select(`
          *
        `)
        .eq('id', policyId)
        .single();
      
      if (policyError) throw policyError;
      
      // Count documents
      const { count: documentsCount, error: documentsError } = await supabase
        .from('policy_documents')
        .select('*', { count: 'exact', head: true })
        .eq('policy_id', policyId);
      
      // Count claims
      const { count: claimsCount, error: claimsError } = await supabase
        .from('claims')
        .select('*', { count: 'exact', head: true })
        .eq('policy_id', policyId);
      
      // Count addendums
      const { count: addendumsCount, error: addendumsError } = await supabase
        .from('policy_addendums')
        .select('*', { count: 'exact', head: true })
        .eq('policy_id', policyId);
      
      return {
        ...policyData,
        documents_count: documentsCount || 0,
        claims_count: claimsCount || 0,
        addendums_count: addendumsCount || 0
      };
    },
    meta: {
      callbacks: {
        onSuccess: () => {
          // Log the view activity
          if (policyId) {
            logActivity({
              entityType: "policy",
              entityId: policyId,
              action: "view",
              details: { timestamp: new Date().toISOString() }
            });
          }
        }
      }
    }
  });
};
