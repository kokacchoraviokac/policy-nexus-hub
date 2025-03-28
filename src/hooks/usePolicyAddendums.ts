
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { PolicyAddendum } from "@/types/policies";

export const usePolicyAddendums = (policyId: string) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const {
    data: addendums,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['policy-addendums', policyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('policy_addendums')
        .select('*')
        .eq('policy_id', policyId)
        .order('effective_date', { ascending: false });
      
      if (error) throw error;
      return data as PolicyAddendum[];
    },
    enabled: !!policyId
  });
  
  const deleteAddendumMutation = useMutation({
    mutationFn: async (addendumId: string) => {
      const { error } = await supabase
        .from('policy_addendums')
        .delete()
        .eq('id', addendumId);
      
      if (error) throw error;
      return addendumId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['policy-addendums', policyId] });
      toast({
        title: t("addendumDeleted"),
        description: t("addendumDeletedSuccess"),
      });
    },
    onError: (error) => {
      console.error('Error deleting addendum:', error);
      toast({
        title: t("addendumDeleteError"),
        description: error instanceof Error ? error.message : t("unknownError"),
        variant: "destructive",
      });
    }
  });
  
  const getLatestAddendum = (): PolicyAddendum | undefined => {
    if (!addendums || addendums.length === 0) return undefined;
    return addendums[0];
  };

  return {
    addendums,
    isLoading,
    isError,
    error,
    refetch,
    deleteAddendum: deleteAddendumMutation.mutate,
    isDeletingAddendum: deleteAddendumMutation.isPending,
    getLatestAddendum,
    addendumCount: addendums?.length || 0
  };
};
