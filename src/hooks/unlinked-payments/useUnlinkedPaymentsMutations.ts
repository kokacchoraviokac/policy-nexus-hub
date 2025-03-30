
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

export const useUnlinkedPaymentsMutations = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const linkPaymentMutation = useMutation({
    mutationFn: async ({ paymentId, policyId }: { paymentId: string; policyId: string }) => {
      // Get policy info to update payment record with details
      const { data: policyData, error: policyError } = await supabase
        .from('policies')
        .select('policy_number, policyholder_name')
        .eq('id', policyId)
        .single();
      
      if (policyError) throw policyError;
      
      // Update the unlinked payment with the policy link
      const { error } = await supabase
        .from('unlinked_payments')
        .update({
          linked_policy_id: policyId,
          linked_at: new Date().toISOString(),
          linked_by: (await supabase.auth.getUser()).data.user?.id,
          status: 'linked'
        })
        .eq('id', paymentId);
      
      if (error) throw error;
      
      // Log the linking action in activity logs
      await supabase
        .from('activity_logs')
        .insert({
          entity_id: paymentId,
          entity_type: 'unlinked_payment',
          action: 'link',
          details: {
            policy_id: policyId,
            policy_number: policyData.policy_number,
            policyholder_name: policyData.policyholder_name
          },
          user_id: (await supabase.auth.getUser()).data.user?.id,
          company_id: (await supabase.auth.getUser()).data.user?.id
        })
        .single();
      
      return { paymentId, policyId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unlinked-payments'] });
      queryClient.invalidateQueries({ queryKey: ['policy-payments'] });
      toast({
        title: t("paymentLinkSuccess"),
        description: t("paymentSuccessfullyLinked"),
      });
    },
    onError: (error) => {
      console.error('Error linking payment:', error);
      toast({
        title: t("errorLinkingPayment"),
        description: error instanceof Error ? error.message : t("unknownError"),
        variant: "destructive",
      });
    },
  });

  // Add the ability to unlink a payment if needed
  const unlinkPaymentMutation = useMutation({
    mutationFn: async (paymentId: string) => {
      const { error } = await supabase
        .from('unlinked_payments')
        .update({
          linked_policy_id: null,
          linked_at: null,
          linked_by: null,
          status: 'unlinked'
        })
        .eq('id', paymentId);
      
      if (error) throw error;
      return paymentId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unlinked-payments'] });
      queryClient.invalidateQueries({ queryKey: ['policy-payments'] });
      toast({
        title: t("paymentUnlinked"),
        description: t("paymentSuccessfullyUnlinked"),
      });
    },
    onError: (error) => {
      console.error('Error unlinking payment:', error);
      toast({
        title: t("errorUnlinkingPayment"),
        description: error instanceof Error ? error.message : t("unknownError"),
        variant: "destructive",
      });
    },
  });

  return {
    linkPayment: linkPaymentMutation.mutate,
    isLinking: linkPaymentMutation.isPending,
    unlinkPayment: unlinkPaymentMutation.mutate,
    isUnlinking: unlinkPaymentMutation.isPending
  };
};
