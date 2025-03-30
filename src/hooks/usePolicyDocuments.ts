
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface PolicyDocument {
  id: string;
  policy_id: string;
  document_name: string;
  document_type: string;
  file_path: string;
  uploaded_by: string;
  created_at: string;
  updated_at: string;
}

export const usePolicyDocuments = (policyId: string) => {
  const {
    data: documents,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['policy-documents', policyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('policy_documents')
        .select('*')
        .eq('policy_id', policyId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as PolicyDocument[];
    },
    enabled: !!policyId
  });
  
  return {
    documents,
    isLoading,
    isError,
    error,
    refetch,
    documentsCount: documents?.length || 0
  };
};
